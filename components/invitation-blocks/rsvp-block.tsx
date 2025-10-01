"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Heart,
  Users,
  Mail,
  Phone,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { RsvpBlockData, ColorScheme } from "@/types/invitation-blocks";
import type { Database } from "@/types/database.types";

type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type ConfirmationInsert = Database['public']['Tables']['confirmations']['Insert'];

interface RsvpBlockProps {
  data: RsvpBlockData;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  colorScheme: ColorScheme;
}

const confirmationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  response: z.enum(["yes", "no", "maybe"], {
    message: "Debes seleccionar una opción",
  }),
  guest_count: z.number().min(1).max(10),
  dietary_restrictions: z.string().optional(),
  additional_notes: z.string().optional(),
});

type ConfirmationForm = z.infer<typeof confirmationSchema>;

export function RsvpBlock({
  data,
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  colorScheme,
}: RsvpBlockProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConfirmationForm>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      response: undefined,
      guest_count: 1,
      dietary_restrictions: "",
      additional_notes: "",
    },
  });

  const watchResponse = form.watch("response");

  const handleSubmit = async (formData: ConfirmationForm) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Save guest data
      const guestData: GuestInsert = {
        event_id: eventId,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        status: formData.response === "yes" ? "confirmed" : formData.response === "no" ? "declined" : "pending",
        guest_count: formData.guest_count,
        message: formData.additional_notes || null,
        dietary_restrictions: formData.dietary_restrictions || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: savedGuest, error: guestError } = await (supabase.from('guests').insert as any)(guestData)
        .select()
        .single();

      if (guestError) {
        throw guestError;
      }

      // Save to confirmations table
      const confirmationData: ConfirmationInsert = {
        event_id: eventId,
        guest_id: savedGuest.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        response: formData.response,
        guest_count: formData.guest_count,
        dietary_restrictions: formData.dietary_restrictions || null,
        additional_notes: formData.additional_notes || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: confirmationError } = await (supabase.from('confirmations').insert as any)(confirmationData);

      if (confirmationError) {
        console.error('Error saving confirmation:', confirmationError);
      }

      // Sync with Google Sheets if confirmed
      if (formData.response === "yes") {
        try {
          await fetch('/api/google-sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'confirm_guest',
              guestData: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                status: 'confirmed',
                guest_count: formData.guest_count,
                dietary_restrictions: formData.dietary_restrictions,
                message: formData.additional_notes,
              },
              eventData: {
                id: eventId,
                title: eventTitle,
                date: eventDate,
                time: eventTime,
                location: eventLocation,
              },
            }),
          });
        } catch (sheetsError) {
          console.error('Error syncing with Google Sheets:', sheetsError);
        }
      }

      setIsSubmitted(true);
      toast.success("¡Confirmación enviada exitosamente!");
    } catch (error) {
      console.error("Error submitting confirmation:", error);
      toast.error("Error al enviar la confirmación");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="py-16 px-4"
        style={{ backgroundColor: colorScheme.background }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle
            className="h-16 w-16 mx-auto mb-6"
            style={{ color: colorScheme.accent }}
          />
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            ¡Confirmación Recibida!
          </h2>
          {watchResponse === "yes" ? (
            <p style={{ color: colorScheme.text }} className="mb-6">
              Gracias por confirmar tu asistencia. ¡Esperamos verte en nuestro evento especial!
            </p>
          ) : watchResponse === "no" ? (
            <p style={{ color: colorScheme.text }} className="mb-6">
              Gracias por informarnos. Lamentamos que no puedas acompañarnos.
            </p>
          ) : (
            <p style={{ color: colorScheme.text }} className="mb-6">
              Gracias por tu respuesta. Te mantendremos informado.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-16 px-4"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Confirma tu Asistencia
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
          {data.deadline && (
            <p style={{ color: colorScheme.textLight }}>
              Por favor responde antes del {new Date(data.deadline).toLocaleDateString('es-CO')}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Nombre Completo *
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Tu nombre completo"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            {data.requireEmail && (
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="tu@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Phone */}
            {data.requirePhone && (
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfono *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="+57 300 123 4567"
                />
              </div>
            )}

            {/* RSVP Response */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                ¿Podrás acompañarnos? *
              </Label>
              <RadioGroup
                value={form.watch("response")}
                onValueChange={(value) =>
                  form.setValue("response", value as "yes" | "no" | "maybe")
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer">
                    ✅ Sí, asistiré con mucho gusto
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer">
                    ❌ No, no podré asistir
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe" className="flex-1 cursor-pointer">
                    🤔 Tal vez, aún no estoy seguro/a
                  </Label>
                </div>
              </RadioGroup>
              {form.formState.errors.response && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.response.message}
                </p>
              )}
            </div>

            {/* Guest Count */}
            {data.allowPlusOnes && watchResponse === "yes" && (
              <div>
                <Label htmlFor="guest_count">
                  Número de acompañantes (incluyéndote)
                </Label>
                <Input
                  id="guest_count"
                  type="number"
                  min="1"
                  max={data.maxGuestsPerInvite || 5}
                  {...form.register("guest_count", {
                    valueAsNumber: true,
                    min: 1,
                    max: data.maxGuestsPerInvite || 5,
                  })}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Máximo {data.maxGuestsPerInvite || 5} personas por invitación
                </p>
              </div>
            )}

            {/* Dietary Restrictions */}
            {watchResponse === "yes" && (
              <div>
                <Label htmlFor="dietary_restrictions">
                  Restricciones alimentarias (Opcional)
                </Label>
                <Input
                  id="dietary_restrictions"
                  {...form.register("dietary_restrictions")}
                  placeholder="Vegetariano, sin gluten, alergias, etc."
                />
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <Label htmlFor="additional_notes">
                Mensaje adicional (Opcional)
              </Label>
              <Textarea
                id="additional_notes"
                {...form.register("additional_notes")}
                placeholder="Cualquier comentario o mensaje..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-lg py-6"
              disabled={isLoading}
              style={{
                backgroundColor: colorScheme.primary,
                color: 'white',
              }}
            >
              {isLoading ? "Enviando..." : "Confirmar Asistencia"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p style={{ color: colorScheme.textLight }} className="text-sm mb-4">
            ¿Tienes alguna pregunta?
          </p>
          <Button
            variant="outline"
            asChild
            style={{
              borderColor: colorScheme.primary,
              color: colorScheme.primary,
            }}
          >
            <a
              href={`https://wa.me/573001234567?text=Hola, tengo una consulta sobre ${encodeURIComponent(eventTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

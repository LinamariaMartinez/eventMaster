"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { invitationStorage, eventStorage, guestStorage, type Invitation, type Event } from "@/lib/storage";
import type { Event as EventWithSettings } from "@/types";

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

interface PageProps {
  params: {
    id: string;
  };
}

export default function InvitationPage({ params }: PageProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Load invitation and event data by token
  useEffect(() => {
    const loadInvitationData = async () => {
      try {
        const foundInvitation = invitationStorage.getByToken(params.id);
        
        if (!foundInvitation) {
          setNotFound(true);
          return;
        }
        
        setInvitation(foundInvitation);
        
        const foundEvent = eventStorage.getById(foundInvitation.eventId);
        setEvent(foundEvent);
        
      } catch (error) {
        console.error('Error loading invitation:', error);
        setNotFound(true);
      }
    };

    loadInvitationData();
  }, [params.id]);

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

  const handleSubmit = async (data: ConfirmationForm) => {
    if (!invitation || !event) return;
    
    setIsLoading(true);

    try {
      // Save guest data to database
      const guestData = {
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        status: data.response === "yes" ? "confirmed" : data.response === "no" ? "declined" : "pending",
        eventId: event.id,
        guestCount: data.guest_count,
        message: data.additional_notes || "",
        dietaryRestrictions: data.dietary_restrictions || "",
      } as const;

      const savedGuest = guestStorage.add(guestData);
      console.log('Guest RSVP saved:', savedGuest);

      setIsSubmitted(true);
      toast.success("¡Confirmación enviada exitosamente!");
    } catch (error) {
      console.error("Error submitting confirmation:", error);
      toast.error("Error al enviar la confirmación");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!invitation && !notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p>Cargando invitación...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invitación No Encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Esta invitación no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted && invitation && event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${invitation.customStyles.backgroundColor} 0%, ${invitation.customStyles.accentColor} 100%)`,
        }}
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Confirmación Recibida!
            </h2>
            {watchResponse === "yes" ? (
              <p className="text-gray-600 mb-6">
                Gracias por confirmar tu asistencia. ¡Esperamos verte en nuestro
                evento especial!
              </p>
            ) : watchResponse === "no" ? (
              <p className="text-gray-600 mb-6">
                Gracias por informarnos. Lamentamos que no puedas acompañarnos.
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                Gracias por tu respuesta. Te mantendremos informado sobre
                cualquier actualización.
              </p>
            )}

            <div className="space-y-3">
              <Button
                className="w-full"
                style={{ backgroundColor: (event as unknown as EventWithSettings).settings?.colors?.primary || "#0066ff" }}
                asChild
              >
                <a
                  href={`https://wa.me/573001234567?text=Hola, tengo una consulta sobre ${encodeURIComponent(event.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </a>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure both invitation and event are loaded before rendering
  if (!invitation || !event) {
    return null;
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: `linear-gradient(135deg, ${invitation.customStyles.backgroundColor} 0%, ${invitation.customStyles.accentColor} 100%)`,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <Card
          className="mb-8"
          style={{ 
            backgroundColor: invitation.customStyles.backgroundColor,
            color: invitation.customStyles.textColor 
          }}
        >
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <Heart
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: invitation.customStyles.accentColor }}
              />
              <h1
                className="text-4xl font-bold mb-4"
                style={{ 
                  color: invitation.customStyles.accentColor,
                  fontFamily: invitation.customStyles.fontFamily === 'serif' ? 'serif' : 'sans-serif'
                }}
              >
                {invitation.title}
              </h1>
              <p className="text-lg opacity-80 mb-6">
                Nos complace invitarte a nuestra celebración
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Calendar
                  className="h-5 w-5"
                  style={{ color: invitation.customStyles.accentColor }}
                />
                <span>{invitation.content.eventDate || event.date}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock
                  className="h-5 w-5"
                  style={{ color: invitation.customStyles.accentColor }}
                />
                <span>{invitation.content.eventTime || event.time}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin
                  className="h-5 w-5"
                  style={{ color: invitation.customStyles.accentColor }}
                />
                <span>{invitation.content.venue || event.location}</span>
              </div>
            </div>

            {(invitation.description || event.description) && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                {invitation.description || event.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* RSVP Form */}
        <Card>
          <CardHeader className="text-center pb-4">
            <h2
              className="text-2xl font-bold"
              style={{ color: (event as unknown as EventWithSettings).settings?.colors?.primary || "#0066ff" }}
            >
              Confirma tu Asistencia
            </h2>
            {(event as unknown as EventWithSettings).settings.rsvpDeadline && (
              <p className="text-sm text-gray-600">
                Por favor responde antes del {(event as unknown as EventWithSettings).settings.rsvpDeadline}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
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
              {(event as unknown as EventWithSettings).settings.requireEmail && (
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email {(event as unknown as EventWithSettings).settings.requireEmail ? "*" : "(Opcional)"}
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
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfono {(event as unknown as EventWithSettings).settings.requirePhone ? "*" : "(Opcional)"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="+57 300 123 4567"
                />
              </div>

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
              {(event as unknown as EventWithSettings).settings.allowPlusOnes && watchResponse === "yes" && (
                <div>
                  <Label htmlFor="guest_count">
                    Número de acompañantes (incluyéndote)
                  </Label>
                  <Input
                    id="guest_count"
                    type="number"
                    min="1"
                    max={(event as unknown as EventWithSettings).settings.maxGuestsPerInvite}
                    {...form.register("guest_count", {
                      valueAsNumber: true,
                      min: 1,
                      max: (event as unknown as EventWithSettings).settings.maxGuestsPerInvite,
                    })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Máximo {(event as unknown as EventWithSettings).settings.maxGuestsPerInvite} personas por
                    invitación
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
                  placeholder="¿Tienes algún mensaje para los novios?"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-lg py-3"
                style={{ backgroundColor: (event as unknown as EventWithSettings).settings?.colors?.primary || "#0066ff" }}
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Confirmar Asistencia"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm mb-4">¿Tienes alguna pregunta?</p>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            asChild
          >
            <a
              href={`https://wa.me/573001234567?text=Hola, tengo una consulta sobre ${encodeURIComponent(event.title)}`}
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

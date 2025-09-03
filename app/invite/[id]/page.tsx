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
import { createClient } from "@/lib/supabase/client";
import { PremiumLandingTemplate } from "@/components/invitations/premium-landing-template";
import type { Database } from "@/types/database.types";

type Event = Database['public']['Tables']['events']['Row'];
type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type ConfirmationInsert = Database['public']['Tables']['confirmations']['Insert'];

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
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Load event data by ID from Supabase
  useEffect(() => {
    const loadEventData = async () => {
      try {
        const supabase = createClient();
        
        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error || !eventData) {
          setNotFound(true);
          return;
        }
        
        setEvent(eventData);
        
      } catch (error) {
        console.error('Error loading event:', error);
        setNotFound(true);
      }
    };

    loadEventData();
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
    if (!event) return;
    
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Save guest data to Supabase
      const guestData: GuestInsert = {
        event_id: event.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        status: data.response === "yes" ? "confirmed" : data.response === "no" ? "declined" : "pending",
        guest_count: data.guest_count,
        message: data.additional_notes || null,
        dietary_restrictions: data.dietary_restrictions || null,
      };

      const { data: savedGuest, error: guestError } = await supabase
        .from('guests')
        .insert(guestData)
        .select()
        .single();

      if (guestError) {
        throw guestError;
      }

      // Also save to confirmations table for tracking
      const confirmationData: ConfirmationInsert = {
        event_id: event.id,
        guest_id: savedGuest.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        response: data.response,
        guest_count: data.guest_count,
        dietary_restrictions: data.dietary_restrictions || null,
        additional_notes: data.additional_notes || null,
      };

      const { error: confirmationError } = await supabase
        .from('confirmations')
        .insert(confirmationData);

      if (confirmationError) {
        console.error('Error saving confirmation:', confirmationError);
        // Don't throw here as guest was saved successfully
      }

      // Sync with Google Sheets if guest confirmed
      if (data.response === "yes") {
        try {
          console.log('[invite-form] Syncing confirmed guest with Google Sheets:', data.name);
          
          await fetch('/api/google-sheets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'confirm_guest',
              guestData: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                status: 'confirmed',
                guest_count: data.guest_count,
                dietary_restrictions: data.dietary_restrictions,
                message: data.additional_notes,
              },
              eventData: {
                id: event.id,
                title: event.title,
                date: event.date,
                time: event.time,
                location: event.location
              }
            }),
          });
          
          console.log('[invite-form] Successfully synced with Google Sheets');
        } catch (sheetsError) {
          console.error('Error adding to Google Sheets:', sheetsError);
          // Don't throw here as the main save was successful
        }
      }

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
  if (!event && !notFound) {
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

  if (isSubmitted && event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-burgundy/20 to-burgundy/40"
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
                className="w-full bg-burgundy hover:bg-burgundy/90 text-white"
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

  // Ensure event is loaded before rendering
  if (!event) {
    return null;
  }

  // Check if this event uses a premium landing page template
  const isPremiumLandingTemplate = (templateId: string) => {
    return templateId && templateId.includes('landing');
  };

  // Get template ID from event settings or use default
  const templateId = (event.settings as Record<string, unknown>)?.templateId as string || 'default';
  
  // If it's a premium landing template, use the premium component
  if (isPremiumLandingTemplate(templateId)) {
    return <PremiumLandingTemplate event={event} templateId={templateId} />;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cream/20 to-burgundy/20">
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-burgundy/20">
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-burgundy" />
              <h1 className="text-4xl font-bold mb-4 text-burgundy font-serif">
                {event.title}
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Nos complace invitarte a nuestra celebración
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5 text-burgundy" />
                <span>{new Date(event.date).toLocaleDateString('es-CO', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-burgundy" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5 text-burgundy" />
                <span>{event.location}</span>
              </div>
            </div>

            {event.description && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                {event.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* RSVP Form */}
        <Card>
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold text-burgundy">
              Confirma tu Asistencia
            </h2>
{event.settings && typeof (event.settings as Record<string, unknown>).rsvpDeadline === 'string' ? (
              <p className="text-sm text-gray-600">
                Por favor responde antes del {String((event.settings as Record<string, unknown>).rsvpDeadline)}
              </p>
            ) : null}
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Name section */}
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
              {event.settings && (event.settings as Record<string, unknown>).requireEmail ? (
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email {(event.settings as Record<string, unknown>).requireEmail ? "*" : "(Opcional)"}
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
              ) : null}
              
              <div>
                <Label htmlFor="phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Teléfono {String(event.settings && (event.settings as Record<string, unknown>).requirePhone ? "*" : "(Opcional)")}
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
              {event.settings && (event.settings as Record<string, unknown>).allowPlusOnes && watchResponse === "yes" ? (
                <div>
                  <Label htmlFor="guest_count">
                    Número de acompañantes (incluyéndote)
                  </Label>
                  <Input
                    id="guest_count"
                    type="number"
                    min="1"
                    max={((event.settings as Record<string, unknown>)?.maxGuestsPerInvite as number) || 5}
                    {...form.register("guest_count", {
                      valueAsNumber: true,
                      min: 1,
                      max: ((event.settings as Record<string, unknown>)?.maxGuestsPerInvite as number) || 5,
                    })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Máximo {((event.settings as Record<string, unknown>)?.maxGuestsPerInvite as number) || 5} personas por invitación
                  </p>
                </div>
              ) : null}

              {/* Dietary Restrictions */}
              {watchResponse === "yes" ? (
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
              ) : null}

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
                className="w-full text-lg py-3 bg-burgundy hover:bg-burgundy/90 text-white"
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

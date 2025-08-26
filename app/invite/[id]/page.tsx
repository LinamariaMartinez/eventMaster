'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  MessageSquare,
  CheckCircle,
  Phone,
  Mail,
  Users
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const confirmationSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  response: z.enum(["yes", "no", "maybe"], { message: "Debes seleccionar una opción" }),
  guest_count: z.number().min(1).max(10),
  dietary_restrictions: z.string().optional(),
  additional_notes: z.string().optional()
})

type ConfirmationForm = z.infer<typeof confirmationSchema>

interface PageProps {
  params: {
    id: string
  }
}

export default function InvitationPage({ params }: PageProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock event data - vendría de la API
  const event = {
    id: params.id,
    title: 'Boda de María y Carlos',
    date: '15 de Febrero, 2024',
    time: '18:00',
    location: 'Salón de Eventos Los Jardines, Medellín',
    description: 'Celebremos juntos este momento tan especial en nuestras vidas. Tu presencia hará que este día sea aún más memorable.',
    settings: {
      allowPlusOnes: true,
      requirePhone: false,
      requireEmail: true,
      maxGuestsPerInvite: 4,
      colors: {
        primary: '#8B4B6B',
        secondary: '#F5F1E8',
        accent: '#D4A574'
      },
      rsvpDeadline: '10 de Febrero, 2024'
    }
  }

  const form = useForm<ConfirmationForm>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      response: undefined,
      guest_count: 1,
      dietary_restrictions: '',
      additional_notes: ''
    }
  })

  const watchResponse = form.watch("response")

  const handleSubmit = async (data: ConfirmationForm) => {
    setIsLoading(true)

    try {
      // Aquí iría la llamada a la API para guardar la confirmación
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubmitted(true)
      toast.success("¡Confirmación enviada exitosamente!")
    } catch (error) {
      console.error('Error submitting confirmation:', error)
      toast.error("Error al enviar la confirmación")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${event.settings.colors.primary} 0%, ${event.settings.colors.accent} 100%)` 
        }}
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Confirmación Recibida!
            </h2>
            {watchResponse === 'yes' ? (
              <p className="text-gray-600 mb-6">
                Gracias por confirmar tu asistencia. ¡Esperamos verte en nuestro evento especial!
              </p>
            ) : watchResponse === 'no' ? (
              <p className="text-gray-600 mb-6">
                Gracias por informarnos. Lamentamos que no puedas acompañarnos.
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                Gracias por tu respuesta. Te mantendremos informado sobre cualquier actualización.
              </p>
            )}
            
            <div className="space-y-3">
              <Button 
                className="w-full"
                style={{ backgroundColor: event.settings.colors.primary }}
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
                <Link href="/">
                  Volver al Inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{ 
        background: `linear-gradient(135deg, ${event.settings.colors.primary} 0%, ${event.settings.colors.accent} 100%)` 
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <Card className="mb-8" style={{ backgroundColor: event.settings.colors.secondary }}>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <Heart className="h-12 w-12 mx-auto mb-4" style={{ color: event.settings.colors.primary }} />
              <h1 className="text-4xl font-playfair font-bold mb-4" style={{ color: event.settings.colors.primary }}>
                {event.title}
              </h1>
              <p className="text-lg opacity-80 mb-6">
                Nos complace invitarte a nuestra celebración
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" style={{ color: event.settings.colors.accent }} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5" style={{ color: event.settings.colors.accent }} />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-5 w-5" style={{ color: event.settings.colors.accent }} />
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
            <h2 className="text-2xl font-bold" style={{ color: event.settings.colors.primary }}>
              Confirma tu Asistencia
            </h2>
            {event.settings.rsvpDeadline && (
              <p className="text-sm text-gray-600">
                Por favor responde antes del {event.settings.rsvpDeadline}
              </p>
            )}
          </CardHeader>

          <CardContent>
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
              {event.settings.requireEmail && (
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email {event.settings.requireEmail ? '*' : '(Opcional)'}
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
                  Teléfono {event.settings.requirePhone ? '*' : '(Opcional)'}
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
                  onValueChange={(value) => form.setValue("response", value as "yes" | "no" | "maybe")}
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
              {event.settings.allowPlusOnes && watchResponse === 'yes' && (
                <div>
                  <Label htmlFor="guest_count">
                    Número de acompañantes (incluyéndote)
                  </Label>
                  <Input
                    id="guest_count"
                    type="number"
                    min="1"
                    max={event.settings.maxGuestsPerInvite}
                    {...form.register("guest_count", { 
                      valueAsNumber: true,
                      min: 1,
                      max: event.settings.maxGuestsPerInvite
                    })}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Máximo {event.settings.maxGuestsPerInvite} personas por invitación
                  </p>
                </div>
              )}

              {/* Dietary Restrictions */}
              {watchResponse === 'yes' && (
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
                style={{ backgroundColor: event.settings.colors.primary }}
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Confirmar Asistencia'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm mb-4">
            ¿Tienes alguna pregunta?
          </p>
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
  )
}
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle, Clock, Users, Send } from "lucide-react";
import { Invitation, Guest, guestStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { DataConsent, ConsentState } from "@/components/legal/data-consent";

interface RSVPFormProps {
  invitation: Invitation;
  onSubmit?: (data: { guest: Guest; stats: { sentCount: number; openedCount: number; respondedCount: number } }) => void;
}

interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
  response: "confirmed" | "declined" | "pending";
  guestCount: number;
  message: string;
  dietaryRestrictions: string;
}

export function RSVPForm({ invitation, onSubmit }: RSVPFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    email: "",
    phone: "",
    response: "pending",
    guestCount: 1,
    message: "",
    dietaryRestrictions: "",
  });
  const [consents, setConsents] = useState<ConsentState>({
    dataProcessing: false,
    communications: false,
    analytics: false,
    marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof RSVPFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required consent
    if (!consents.dataProcessing) {
      toast({
        title: "Consentimiento requerido",
        description: "Debe aceptar el tratamiento de datos personales para enviar su confirmación.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create guest entry
      const newGuest = guestStorage.add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.response,
        eventId: invitation.eventId,
        guestCount: formData.guestCount,
        message: formData.message,
        dietaryRestrictions: formData.dietaryRestrictions,
      });

      // Update invitation statistics
      const updatedStats = {
        sentCount: invitation.sentCount,
        openedCount: invitation.openedCount + 1,
        respondedCount: invitation.respondedCount + 1,
      };

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit({ guest: newGuest, stats: updatedStats });
      }

      setIsSubmitted(true);
      toast({
        title: "¡Respuesta enviada!",
        description: `Gracias ${formData.name}, hemos recibido tu ${
          formData.response === "confirmed" 
            ? "confirmación" 
            : formData.response === "declined" 
            ? "respuesta" 
            : "respuesta"
        }.`,
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar tu respuesta. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <div className="mb-6">
            {formData.response === "confirmed" ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : formData.response === "declined" ? (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold mb-4">
            {formData.response === "confirmed" 
              ? "¡Confirmado!" 
              : formData.response === "declined"
              ? "Respuesta recibida"
              : "Respuesta guardada"
            }
          </h3>
          
          <p className="text-muted-foreground mb-6">
            {formData.response === "confirmed" 
              ? `Gracias ${formData.name}, esperamos verte en el evento.`
              : formData.response === "declined"
              ? `Gracias ${formData.name} por hacernos saber.`
              : `Hemos guardado tu respuesta, ${formData.name}.`
            }
          </p>

          {formData.response === "confirmed" && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Detalles de tu confirmación:</p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invitados:</span>
                  <span>{formData.guestCount} persona{formData.guestCount !== 1 ? "s" : ""}</span>
                </div>
                {formData.email && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Send className="h-5 w-5" />
          Confirmar Asistencia
        </CardTitle>
        <CardDescription>
          Por favor completa el formulario para confirmar tu asistencia
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+57 300 123 4567"
            />
          </div>

          <div className="space-y-3">
            <Label>¿Asistirás al evento? *</Label>
            <RadioGroup
              value={formData.response}
              onValueChange={(value) => handleInputChange("response", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="confirmed" id="confirmed" />
                <Label htmlFor="confirmed" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Sí, asistiré</span>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="declined" id="declined" />
                <Label htmlFor="declined" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">No podré asistir</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.response === "confirmed" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="guestCount">Número de acompañantes (incluyéndote)</Label>
                <Select
                  value={formData.guestCount.toString()}
                  onValueChange={(value) => handleInputChange("guestCount", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {num} persona{num !== 1 ? "s" : ""}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">Restricciones alimentarias (opcional)</Label>
                <Input
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                  placeholder="Vegetariano, sin gluten, etc."
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje adicional (opcional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Cualquier comentario adicional..."
              rows={3}
            />
          </div>

          {/* Data Consent Component */}
          <div className="border-t pt-6">
            <DataConsent 
              onConsentChange={setConsents}
              required={true}
              className="border-0 shadow-none p-0"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !consents.dataProcessing}>
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Respuesta
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            * Campos obligatorios
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
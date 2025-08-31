"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Invitation, Event, guestStorage } from "@/lib/storage";
import { 
  LazyComponent,
  LazyPhotoGallery,
  LazyInteractiveMap,
  LazyEventDetailsSections,
  PhotoGallerySkeleton,
  MapSkeleton,
  EventDetailsSkeleton,
  useComponentPerformance
} from "@/components/ui/lazy-component";

interface PremiumPreviewWithFormProps {
  invitation: Partial<Invitation>;
  event: Event | null;
  viewMode: "mobile" | "desktop";
}

export function PremiumPreviewWithForm({
  invitation,
  event,
  viewMode,
}: PremiumPreviewWithFormProps) {
  const { toast } = useToast();
  
  // Performance monitoring
  useComponentPerformance('PremiumPreviewWithForm');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guestCount: "1",
    dietaryRestrictions: "",
    message: "",
  });

  const getBackgroundStyle = () => {
    if (!invitation.customStyles) return { backgroundColor: "#ffffff" };

    const { backgroundType, backgroundColor, gradientFrom, gradientTo, backgroundImage } = invitation.customStyles;

    switch (backgroundType) {
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        };
      case "image":
        return {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: backgroundColor,
        };
      default:
        return { backgroundColor };
    }
  };

  const getShadowStyle = (level: number) => {
    const shadows = [
      "none",
      "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    ];
    return shadows[level] || shadows[2];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha del evento";
    try {
      return new Date(dateString).toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invitation.eventId || !formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save guest data to database
      const guestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: "confirmed" as const,
        eventId: invitation.eventId,
        guestCount: parseInt(formData.guestCount),
        message: formData.message,
        dietaryRestrictions: formData.dietaryRestrictions,
      };

      const savedGuest = guestStorage.add(guestData);

      toast({
        title: "¡RSVP Confirmado!",
        description: `Gracias ${formData.name}, hemos confirmado tu asistencia para ${formData.guestCount} ${parseInt(formData.guestCount) === 1 ? 'persona' : 'personas'}.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        guestCount: "1",
        dietaryRestrictions: "",
        message: "",
      });

      console.log("Guest saved:", savedGuest);
    } catch (error) {
      console.error("Error saving RSVP:", error);
      toast({
        title: "Error",
        description: "No se pudo confirmar tu asistencia. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full h-full flex items-start justify-center p-4">
      <div
        className="w-full max-w-2xl mx-auto transition-all duration-300"
        style={{
          ...getBackgroundStyle(),
          color: invitation.customStyles?.textColor || "#000000",
          fontFamily: invitation.customStyles?.fontFamily === "serif" 
            ? "Georgia, serif" 
            : invitation.customStyles?.fontFamily === "script" 
            ? "cursive" 
            : "system-ui, sans-serif",
          fontSize: invitation.customStyles?.fontSize || "16px",
          borderRadius: `${invitation.layout?.borderRadius || 12}px`,
          padding: `${invitation.layout?.contentPadding || 32}px`,
          boxShadow: getShadowStyle(invitation.layout?.shadowLevel || 2),
          minHeight: viewMode === "mobile" ? "600px" : "700px",
        }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div style={{ minHeight: `${invitation.layout?.headerHeight || 120}px` }} className="flex flex-col justify-center text-center">
            <div 
              className="w-16 h-1 mx-auto mb-6 rounded"
              style={{ backgroundColor: invitation.customStyles?.accentColor || "#3b82f6" }}
            />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {invitation.title || event?.title || "Título del Evento"}
            </h1>
            <p className="text-sm md:text-base opacity-90 leading-relaxed">
              {invitation.description || event?.description || "Descripción del evento aquí..."}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-4 border-t border-current/20 pt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">📅 Fecha:</span>
              <span>{formatDate(invitation.content?.eventDate || event?.date)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">🕒 Hora:</span>
              <span>{invitation.content?.eventTime || event?.time || "Hora del evento"}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">📍 Lugar:</span>
              <span className="text-center">{invitation.content?.venue || event?.location || "Ubicación del evento"}</span>
            </div>

            {invitation.content?.dressCode && (
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold">👔 Vestimenta:</span>
                <span>{invitation.content.dressCode}</span>
              </div>
            )}
          </div>

          {/* Host Info */}
          <div className="border-t border-current/20 pt-6 text-center">
            <p className="font-medium">
              {invitation.content?.hostName ? `Te invita: ${invitation.content.hostName}` : "Esperamos verte allí"}
            </p>
          </div>

          {/* Photo Gallery - Premium Feature */}
          {invitation.gallery && invitation.gallery.images && invitation.gallery.images.length > 0 && (
            <div className="border-t border-current/20 pt-6">
              <LazyComponent fallback={<PhotoGallerySkeleton />}>
                <LazyPhotoGallery 
                  images={invitation.gallery.images} 
                  captions={invitation.gallery.captions}
                />
              </LazyComponent>
            </div>
          )}

          {/* Interactive Map - Premium Feature */}
          {(invitation.content?.venue || invitation.content?.venueAddress) && (
            <div className="border-t border-current/20 pt-6">
              <LazyComponent fallback={<MapSkeleton />}>
                <LazyInteractiveMap
                  venue={invitation.content.venue || "Ubicación del evento"}
                  address={invitation.content.venueAddress}
                  coordinates={invitation.content.venueCoordinates}
                />
              </LazyComponent>
            </div>
          )}

          {/* Additional Event Details - Premium Feature */}
          <div className="border-t border-current/20 pt-6">
            <LazyComponent fallback={<EventDetailsSkeleton />}>
              <LazyEventDetailsSections
                dressCode={invitation.content?.dressCode}
                giftInfo={invitation.content?.giftInfo}
                giftRegistryUrl={invitation.content?.giftRegistryUrl}
                additionalInfo={invitation.content?.additionalInfo}
              />
            </LazyComponent>
          </div>

          {/* RSVP Form - Premium Feature */}
          <div className="border-t border-current/20 pt-6">
            <h3 className="text-xl font-semibold text-center mb-6">Confirma tu Asistencia</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre completo *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white/10 border-current/30"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white/10 border-current/30"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-white/10 border-current/30"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-sm font-medium">
                    Número de invitados *
                  </Label>
                  <Select value={formData.guestCount} onValueChange={(value) => handleInputChange("guestCount", value)}>
                    <SelectTrigger className="bg-white/10 border-current/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "persona" : "personas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions" className="text-sm font-medium">
                  Restricciones alimentarias
                </Label>
                <Input
                  id="dietaryRestrictions"
                  type="text"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                  className="bg-white/10 border-current/30"
                  placeholder="Vegetariano, vegano, alergias, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Mensaje (opcional)
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="bg-white/10 border-current/30"
                  placeholder="¿Algún mensaje especial?"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6"
                style={{ 
                  backgroundColor: invitation.customStyles?.accentColor || "#3b82f6",
                  color: "white"
                }}
              >
                ✨ Confirmar Asistencia
              </Button>
            </form>
          </div>

          {/* Additional Info */}
          {invitation.content?.additionalInfo && (
            <div className="border-t border-current/20 pt-4 text-center">
              <p className="text-sm opacity-90">
                {invitation.content.additionalInfo}
              </p>
            </div>
          )}

          {/* Example URL for Premium */}
          <div className="text-center text-xs opacity-60 mt-6">
            URL de ejemplo: https://eventoscat.com{invitation.publicUrl || `/invite/${invitation.uniqueToken || "abc123xyz"}`}
          </div>
        </div>
      </div>
    </div>
  );
}
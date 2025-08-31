"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Eye, Copy, ExternalLink, Share } from "lucide-react";
import { Invitation, Event } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { PremiumPreviewWithForm } from "./premium-preview-with-form";
import { createWhatsAppInvitationLink } from "@/lib/whatsapp-service";

interface InvitationPreviewProps {
  invitation: Partial<Invitation>;
  event: Event | null;
  viewMode: "mobile" | "desktop";
  onViewModeChange: (mode: "mobile" | "desktop") => void;
}

export function InvitationPreview({
  invitation,
  event,
  viewMode,
  onViewModeChange,
}: InvitationPreviewProps) {
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    if (invitation.publicUrl) {
      const fullUrl = `${window.location.origin}${invitation.publicUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "URL copiada",
        description: "El enlace de la invitación ha sido copiado al portapapeles",
      });
    }
  };

  const handleShare = async () => {
    if (invitation.publicUrl && navigator.share) {
      try {
        await navigator.share({
          title: invitation.title || "Invitación",
          text: `Te invitamos a nuestro evento: ${invitation.title || "Evento especial"}`,
          url: `${window.location.origin}${invitation.publicUrl}`,
        });
      } catch {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

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

  const previewContent = (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg mx-auto transition-all duration-300"
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
          minHeight: viewMode === "mobile" ? "500px" : "600px",
        }}
      >
        <div className="text-center space-y-6">
          {/* Header */}
          <div style={{ minHeight: `${invitation.layout?.headerHeight || 120}px` }} className="flex flex-col justify-center">
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
          <div className="space-y-4 border-t border-current/20 pt-6">
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
          <div className="border-t border-current/20 pt-6">
            <p className="font-medium">
              {invitation.content?.hostName ? `Te invita: ${invitation.content.hostName}` : "Esperamos verte allí"}
            </p>
            
            {/* Simple: WhatsApp CTA */}
            {invitation.type === "simple" && (
              <div className="mt-4">
                <p className="text-sm opacity-75 mb-3">
                  Confirma tu asistencia vía WhatsApp:
                </p>
                <a
                  href={createWhatsAppInvitationLink(invitation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: invitation.customStyles?.accentColor || "#25D366",
                    textDecoration: 'none'
                  }}
                >
                  📱 Confirmar por WhatsApp
                </a>
              </div>
            )}
            
            {/* Premium: Simple RSVP text for preview */}
            {invitation.type === "premium" && (
              <p className="text-sm opacity-75 mt-2">
                Por favor confirma tu asistencia usando el formulario
              </p>
            )}
          </div>

          {/* Additional Info */}
          {invitation.content?.additionalInfo && (
            <div className="border-t border-current/20 pt-4">
              <p className="text-sm opacity-90">
                {invitation.content.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa
          </CardTitle>
          <div className="flex items-center gap-2">
            {invitation.publicUrl && (
              <>
                <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar URL
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-1" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={invitation.publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("desktop")}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Escritorio
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("mobile")}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Móvil
          </Button>
          <Badge variant="secondary" className="ml-2">
            {viewMode === "mobile" ? "360x640" : "1024x768"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          className={`transition-all duration-300 mx-auto bg-gray-100 ${
            viewMode === "mobile" 
              ? "w-[360px] h-[640px]" 
              : invitation.type === "premium" 
                ? "w-full h-[800px]" 
                : "w-full h-[600px]"
          }`}
          style={{
            maxWidth: viewMode === "mobile" ? "360px" : "100%",
            borderRadius: viewMode === "mobile" ? "24px" : "0",
            overflow: invitation.type === "premium" ? "auto" : "hidden",
          }}
        >
          {invitation.type === "premium" ? (
            <PremiumPreviewWithForm
              invitation={invitation}
              event={event}
              viewMode={viewMode}
            />
          ) : (
            previewContent
          )}
        </div>
      </CardContent>
    </Card>
  );
}
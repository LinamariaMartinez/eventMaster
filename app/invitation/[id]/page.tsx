"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Share2, Download } from "lucide-react";
import { RSVPForm } from "@/components/invitations/rsvp-form";
import { invitationStorage, eventStorage, type Invitation, type Event } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function PublicInvitationPage() {
  const params = useParams();
  const { toast } = useToast();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRSVP, setShowRSVP] = useState(false);

  useEffect(() => {
    if (invitationId) {
      try {
        // Find invitation by ID or public URL
        const foundInvitation = invitationStorage.getById(invitationId) || 
          invitationStorage.getByPublicUrl(`/invitation/${invitationId}`);
        
        if (foundInvitation) {
          setInvitation(foundInvitation);
          
          // Load associated event
          const associatedEvent = eventStorage.getById(foundInvitation.eventId);
          setEvent(associatedEvent);

          // Update opened count
          invitationStorage.update(foundInvitation.id, {
            openedCount: foundInvitation.openedCount + 1,
          });
        }
      } catch (error) {
        console.error("Error loading invitation:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [invitationId]);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: invitation?.title || "Invitación",
          text: `Te invitamos a nuestro evento: ${invitation?.title || "Evento especial"}`,
          url: url,
        });
      } catch (error) {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Enlace copiado",
          description: "El enlace ha sido copiado al portapapeles",
        });
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
      });
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const calendarData = {
      title: encodeURIComponent(event.title),
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      details: encodeURIComponent(event.description || ''),
      location: encodeURIComponent(event.location),
    };

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarData.title}&dates=${calendarData.start}/${calendarData.end}&details=${calendarData.details}&location=${calendarData.location}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const getBackgroundStyle = () => {
    if (!invitation?.customStyles) return { backgroundColor: "#ffffff" };

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

  const formatDate = (dateString: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Invitación no encontrada</h1>
            <p className="text-muted-foreground mb-4">
              La invitación que buscas no existe o ha sido eliminada.
            </p>
            <Image
              src="/placeholder.svg"
              alt="Invitación no encontrada"
              width={200}
              height={150}
              className="mx-auto opacity-50"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with actions */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Invitación {invitation.type === "premium" ? "Premium" : "Simple"}
              </Badge>
              {invitation.status === "published" && (
                <Badge variant="default" className="text-xs bg-green-500">
                  Publicada
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Compartir
              </Button>
              {event && (
                <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
                  <Download className="h-4 w-4 mr-1" />
                  Agregar al calendario
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main invitation content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          {/* Invitation Design */}
          <div className="lg:col-span-2">
            <div className="flex justify-center">
              <div
                className="w-full max-w-lg transition-all duration-300"
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
                  minHeight: "600px",
                }}
              >
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div style={{ minHeight: `${invitation.layout?.headerHeight || 120}px` }} className="flex flex-col justify-center">
                    <div 
                      className="w-16 h-1 mx-auto mb-6 rounded"
                      style={{ backgroundColor: invitation.customStyles?.accentColor || "#3b82f6" }}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                      {invitation.title}
                    </h1>
                    <p className="text-base md:text-lg opacity-90 leading-relaxed">
                      {invitation.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4 border-t border-current/20 pt-6">
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="h-5 w-5" style={{ color: invitation.customStyles?.accentColor }} />
                      <span className="font-semibold">Fecha:</span>
                      <span>{formatDate(invitation.content?.eventDate || event?.date || "")}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <Clock className="h-5 w-5" style={{ color: invitation.customStyles?.accentColor }} />
                      <span className="font-semibold">Hora:</span>
                      <span>{invitation.content?.eventTime || event?.time}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      <MapPin className="h-5 w-5" style={{ color: invitation.customStyles?.accentColor }} />
                      <span className="font-semibold">Lugar:</span>
                      <span className="text-center">{invitation.content?.venue || event?.location}</span>
                    </div>

                    {invitation.content?.dressCode && (
                      <div className="flex items-center justify-center gap-3">
                        <User className="h-5 w-5" style={{ color: invitation.customStyles?.accentColor }} />
                        <span className="font-semibold">Vestimenta:</span>
                        <span>{invitation.content.dressCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Host Info */}
                  <div className="border-t border-current/20 pt-6">
                    <p className="text-lg font-medium">
                      {invitation.content?.hostName ? `Te invita: ${invitation.content.hostName}` : "Esperamos verte allí"}
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                      Por favor confirma tu asistencia
                    </p>
                  </div>

                  {/* Additional Info */}
                  {invitation.content?.additionalInfo && (
                    <div className="border-t border-current/20 pt-4">
                      <p className="text-sm opacity-90">
                        {invitation.content.additionalInfo}
                      </p>
                    </div>
                  )}

                  {/* RSVP Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={() => setShowRSVP(!showRSVP)}
                      size="lg"
                      className="bg-current text-white hover:bg-current/90"
                      style={{ 
                        backgroundColor: invitation.customStyles?.accentColor,
                        color: invitation.customStyles?.backgroundColor 
                      }}
                    >
                      {showRSVP ? "Ocultar formulario" : "Confirmar Asistencia"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="lg:col-span-1">
            {showRSVP && (
              <div className="sticky top-20">
                <RSVPForm 
                  invitation={invitation}
                  onSubmit={(data) => {
                    // Update invitation stats
                    invitationStorage.update(invitation.id, {
                      respondedCount: invitation.respondedCount + 1,
                    });
                    setShowRSVP(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <p>
              Creado con ❤️ usando{" "}
              <span className="font-semibold">Catalina Lezama Eventos</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
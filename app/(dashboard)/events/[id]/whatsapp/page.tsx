"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { CSVImportDialog } from "@/components/dashboard/guests/csv-import-dialog";
import { MessageTemplateEditor } from "@/components/dashboard/whatsapp/message-template-editor";
import { BulkWhatsAppSender } from "@/components/dashboard/whatsapp/bulk-whatsapp-sender";
import { useSupabaseGuests } from "@/hooks/use-supabase-guests";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import type { Database } from "@/types/database.types";

type GuestInsert = Database['public']['Tables']['guests']['Insert'];

const DEFAULT_MESSAGE_TEMPLATE = `¡Hola {nombre}! 👋

Te invitamos a nuestro evento:

🎉 *{evento}*
📅 Fecha: {fecha}
🕒 Hora: {hora}
📍 Lugar: {ubicacion}

Para ver todos los detalles y confirmar tu asistencia, visita:
{url}

¡Esperamos verte allí!

Saludos,
{anfitrion}`;

export default function EventWhatsAppPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { events, loading: eventsLoading } = useSupabaseEvents();
  const { addGuest, updateGuest, getGuestsByEvent, loading: guestsLoading } = useSupabaseGuests();

  const [messageTemplate, setMessageTemplate] = useState(DEFAULT_MESSAGE_TEMPLATE);
  const [activeTab, setActiveTab] = useState("import");

  const event = events.find(e => e.id === eventId);
  const eventGuests = getGuestsByEvent(eventId);

  useEffect(() => {
    if (!eventsLoading && !event) {
      toast.error("Evento no encontrado");
      router.push("/events");
    }
  }, [event, eventsLoading, router]);

  const handleImportGuests = async (guestsToImport: GuestInsert[]) => {
    try {
      const results = await Promise.all(
        guestsToImport.map(guestData => addGuest(guestData))
      );

      const successCount = results.filter(r => r !== null).length;
      const failCount = results.length - successCount;

      if (failCount > 0) {
        toast.warning(`${successCount} invitados importados, ${failCount} fallaron`);
      } else {
        toast.success(`${successCount} invitados importados exitosamente`);
      }

      // Move to template tab after import
      setActiveTab("template");
    } catch (error) {
      toast.error("Error al importar invitados");
      console.error("Import error:", error);
    }
  };

  const handleMarkAsSent = async (guestId: string) => {
    try {
      await updateGuest(guestId, {
        whatsapp_sent: true,
        whatsapp_sent_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error marking as sent:", error);
      throw error;
    }
  };

  if (eventsLoading || guestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const invitationBaseUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${event.id}`;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/events/${eventId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Invitaciones por WhatsApp</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{eventGuests.length}</div>
              <div className="text-sm text-muted-foreground">Total Invitados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {eventGuests.filter(g => g.whatsapp_sent).length}
              </div>
              <div className="text-sm text-muted-foreground">Enviados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {eventGuests.filter(g => !g.whatsapp_sent).length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {eventGuests.filter(g => g.phone).length}
              </div>
              <div className="text-sm text-muted-foreground">Con Teléfono</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import" className="gap-2">
            <Users className="h-4 w-4" />
            Importar
          </TabsTrigger>
          <TabsTrigger value="template" className="gap-2">
            <Settings className="h-4 w-4" />
            Plantilla
          </TabsTrigger>
          <TabsTrigger value="send" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Enviar
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Import Guests */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Importar Invitados desde CSV</CardTitle>
              <CardDescription>
                Carga un archivo CSV con los datos de tus invitados para empezar a enviar invitaciones por WhatsApp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <CSVImportDialog
                  eventId={eventId}
                  onImport={handleImportGuests}
                />
              </div>

              {eventGuests.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Invitados Actuales ({eventGuests.length})</h3>
                  <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Nombre</th>
                          <th className="px-4 py-2 text-left">Teléfono</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventGuests.map((guest) => (
                          <tr key={guest.id} className="border-t">
                            <td className="px-4 py-2">{guest.name}</td>
                            <td className="px-4 py-2">{guest.phone || '-'}</td>
                            <td className="px-4 py-2">{guest.email || '-'}</td>
                            <td className="px-4 py-2">
                              {guest.whatsapp_sent ? '✅ Enviado' : '⏳ Pendiente'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {eventGuests.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("template")}>
                    Continuar a Plantilla
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Configure Template */}
        <TabsContent value="template" className="space-y-6">
          <MessageTemplateEditor
            eventTitle={event.title}
            eventDate={new Date(event.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
            eventTime={event.time}
            eventLocation={event.location}
            hostName="Catalina Lezama"
            onTemplateChange={setMessageTemplate}
            initialTemplate={messageTemplate}
          />

          {eventGuests.filter(g => g.phone).length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("send")}>
                Continuar a Enviar
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Send Invitations */}
        <TabsContent value="send" className="space-y-6">
          {eventGuests.filter(g => g.phone).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay invitados con teléfono</h3>
                <p className="text-muted-foreground mb-4">
                  Importa invitados con números de teléfono para empezar a enviar invitaciones.
                </p>
                <Button onClick={() => setActiveTab("import")}>
                  Ir a Importar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <BulkWhatsAppSender
              guests={eventGuests}
              eventTitle={event.title}
              eventDate={new Date(event.date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
              eventTime={event.time}
              eventLocation={event.location}
              hostName="Catalina Lezama"
              invitationBaseUrl={invitationBaseUrl}
              messageTemplate={messageTemplate}
              onMarkAsSent={handleMarkAsSent}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

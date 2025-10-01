"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Upload,
  Download,
  Send,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { calculateGuestStats, downloadCSV } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { GuestDialog } from "@/components/dashboard/guests/guest-dialog";
import { formatShortDate } from "@/lib/utils/date";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventInvitationsPage({ params }: PageProps) {
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventAndGuests = async () => {
      try {
        const supabase = createClient();

        // Load event data
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", params.id)
          .single();

        if (eventError) {
          console.error("Error loading event:", eventError);
          toast.error("Error al cargar el evento");
          setLoading(false);
          return;
        }

        if (!eventData) {
          console.error("Event not found");
          toast.error("Evento no encontrado");
          setLoading(false);
          return;
        }

        // Type-cast after null check and set event
        setEvent(eventData as Event);

        // Load guests for this event
        const { data: guestsData, error: guestsError } = await supabase
          .from("guests")
          .select("*")
          .eq("event_id", params.id)
          .order("created_at", { ascending: false });

        if (guestsError) {
          console.error("Error loading guests:", guestsError);
          toast.error("Error al cargar invitados");
          return;
        }

        setGuests(guestsData || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadEventAndGuests();
  }, [params.id]);

  const stats = calculateGuestStats(guests);
  const totalExpectedGuests = guests.reduce(
    (sum, guest) => sum + guest.guest_count,
    0,
  );
  const confirmedGuestCount = guests
    .filter((g) => g.status === "confirmed")
    .reduce((sum, guest) => sum + guest.guest_count, 0);

  // TODO: Implement guest import functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleImportGuests = async (
    newGuests: {
      name: string;
      email?: string;
      phone?: string;
      guest_count: number;
      message?: string;
      dietary_restrictions?: string;
    }[],
  ) => {
    // En una app real, esto haría una llamada a la API
    const guestsWithId: Guest[] = newGuests.map((guest, index) => ({
      id: `imported_${Date.now()}_${index}`,
      event_id: params.id,
      name: guest.name,
      email: guest.email || null,
      phone: guest.phone || null,
      status: "pending" as const,
      guest_count: guest.guest_count,
      message: guest.message || null,
      dietary_restrictions: guest.dietary_restrictions || null,
      created_at: new Date().toISOString(),
    }));

    setGuests((prev) => [...prev, ...guestsWithId]);
    setShowCSVImport(false);
    toast.success(`${newGuests.length} invitados importados`);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowGuestDialog(true);
  };

  const handleAddGuest = () => {
    setSelectedGuest(null);
    setShowGuestDialog(true);
  };

  const handleGuestSuccess = async () => {
    // Recargar la lista de invitados
    try {
      const supabase = createClient();
      const { data: guestsData, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", params.id)
        .order("created_at", { ascending: false });

      if (!error && guestsData) {
        setGuests(guestsData);
      }
    } catch (error) {
      console.error("Error reloading guests:", error);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("¿Estás segura de que quieres eliminar este invitado?")) {
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", guestId);

      if (error) {
        console.error("Error deleting guest:", error);
        toast.error("Error al eliminar invitado");
        return;
      }

      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.success("Invitado eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar invitado");
    }
  };

  // TODO: Implement send reminder functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSendReminder = () => {
    // Enviar recordatorio
    toast.success("Recordatorio enviado");
  };

  const copyInvitationLink = () => {
    if (event?.public_url) {
      navigator.clipboard.writeText(event.public_url);
      toast.success("Enlace copiado al portapapeles");
    } else {
      toast.error("No se encontró el enlace de la invitación");
    }
  };

  const shareWhatsApp = () => {
    if (event?.public_url) {
      const message = `🎉 Estás invitado/a a ${event.title}! \n\n📅 ${formatShortDate(event.date)} a las ${event.time}\n📍 ${event.location}\n\nConfirma tu asistencia aquí: ${event.public_url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    } else {
      toast.error("No se encontró el enlace de la invitación");
    }
  };

  const handleExportCSV = () => {
    const exportData = guests.map((guest) => ({
      Nombre: guest.name,
      Email: guest.email || "",
      Teléfono: guest.phone || "",
      Estado: guest.status,
      Acompañantes: guest.guest_count,
      Mensaje: guest.message || "",
      "Restricciones Dietarias": guest.dietary_restrictions || "",
      "Fecha de Creación": new Date(guest.created_at).toLocaleDateString(
        "es-ES",
      ),
    }));

    if (event) {
      downloadCSV(
        exportData,
        `invitados_${event.title.replace(/\s+/g, "_")}_${Date.now()}`,
      );
      toast.success("Lista de invitados exportada");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando invitados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Evento no encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              El evento que buscas no existe o no tienes permisos para verlo.
            </p>
            <Button asChild>
              <Link href="/events">Volver a Eventos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/events/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Evento
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              Gestión de Invitados
            </h1>
            <p className="text-gray-600 mt-1">
              {event.title} • {formatShortDate(event.date)}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => setShowCSVImport(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button onClick={handleAddGuest} className="bg-burgundy hover:bg-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Invitado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-burgundy" />
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy">
                  {stats.total}
                </div>
                <p className="text-sm text-slate-600">Total Invitados</p>
                <p className="text-xs text-slate-500">
                  {totalExpectedGuests} personas esperadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </div>
                <p className="text-sm text-slate-600">Confirmados</p>
                <p className="text-xs text-slate-500">
                  {confirmedGuestCount} personas confirmadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-sm text-slate-600">Pendientes</p>
                <p className="text-xs text-slate-500">Esperando respuesta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.declined}
                </div>
                <p className="text-sm text-slate-600">Declinaron</p>
                <p className="text-xs text-slate-500">No asistirán</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invitation Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-burgundy">Enlace de Invitación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
              <Input
                value={event?.public_url || "Generando..."}
                readOnly
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
              />
              <Button size="sm" variant="outline" onClick={copyInvitationLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={event?.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={shareWhatsApp}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir por WhatsApp
              </Button>
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Send className="h-5 w-5" />
              <span>Enviar Recordatorios</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2"
              onClick={handleExportCSV}
            >
              <Download className="h-5 w-5" />
              <span>Exportar Lista</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span>Ver Estadísticas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-burgundy">Lista de Invitados</CardTitle>
        </CardHeader>
        <CardContent>
          {guests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-burgundy/20">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Acompañantes
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b hover:bg-cream/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {guest.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {guest.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            guest.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : guest.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {guest.status === "confirmed"
                            ? "Confirmado"
                            : guest.status === "declined"
                              ? "Rechazado"
                              : "Pendiente"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {guest.guest_count || 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditGuest(guest)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-burgundy/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No hay invitados
              </h3>
              <p className="text-slate-600 mb-4">
                Comienza añadiendo invitados a este evento
              </p>
              <Button onClick={handleAddGuest} className="bg-burgundy hover:bg-burgundy/90">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Invitado
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Import Modal - Simple placeholder */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Importar Invitados CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept=".csv" />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCSVImport(false)}
                >
                  Cancelar
                </Button>
                <Button className="bg-burgundy hover:bg-burgundy/90">
                  Importar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Guest Add/Edit Dialog */}
      <GuestDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
        eventId={params.id}
        guest={selectedGuest}
        onSuccess={handleGuestSuccess}
      />
    </div>
  );
}

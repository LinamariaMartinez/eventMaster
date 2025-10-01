"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Send,
  Palette,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { toast } from "sonner";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Guest = Database["public"]["Tables"]["guests"]["Row"];

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventAndGuests = async () => {
      if (!eventId) return;

      try {
        const supabase = createClient();

        // Load event data
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) {
          console.error("Error loading event:", eventError);
          toast.error("Error al cargar el evento");
          return;
        }

        setEvent(eventData);

        // Load guests for this event
        const { data: guestsData, error: guestsError } = await supabase
          .from("guests")
          .select("*")
          .eq("event_id", eventId)
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
        setIsLoading(false);
      }
    };

    loadEventAndGuests();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-muted rounded w-3/4 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Evento no encontrado</h1>
          <p className="text-muted-foreground mb-4">
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/events">
            <Button>Volver a Eventos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const confirmedGuests = guests.filter((g) => g.status === "confirmed");
  const pendingGuests = guests.filter((g) => g.status === "pending");
  const declinedGuests = guests.filter((g) => g.status === "declined");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/events">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <Badge className="bg-green-100 text-green-800">Activo</Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Link href={`/events/${event.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar Evento
          </Button>
        </Link>
        <Link href={`/events/${event.id}/invitation-setup`}>
          <Button variant="outline">
            <Palette className="h-4 w-4 mr-2" />
            Configurar Invitación
          </Button>
        </Link>
        <Link href={`/events/${event.id}/invitations`}>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Gestionar Invitados
          </Button>
        </Link>
      </div>

      {/* Event Details */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fecha y Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.date).toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Invitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {confirmedGuests.length} confirmados / {guests.length} total
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width:
                    guests.length > 0
                      ? `${(confirmedGuests.length / guests.length) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {confirmedGuests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {confirmedGuests.length > 0
                ? `${Math.round((confirmedGuests.length / guests.length) * 100)}% del total`
                : "Sin confirmaciones aún"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingGuests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingGuests.length > 0
                ? `${Math.round((pendingGuests.length / guests.length) * 100)}% del total`
                : "Todos han respondido"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Declinaron</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {declinedGuests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {declinedGuests.length > 0
                ? `${Math.round((declinedGuests.length / guests.length) * 100)}% del total`
                : "Nadie ha declinado"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guest List */}
      {guests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Invitados</CardTitle>
            <CardDescription>
              Todos los invitados y su estado de respuesta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["confirmed", "pending", "declined"].map((status) => {
                const statusGuests = guests.filter((g) => g.status === status);
                if (statusGuests.length === 0) return null;

                const statusLabels = {
                  confirmed: "Confirmados",
                  pending: "Pendientes",
                  declined: "Declinaron",
                };

                const statusColors = {
                  confirmed: "text-green-600",
                  pending: "text-yellow-600",
                  declined: "text-red-600",
                };

                return (
                  <div key={status}>
                    <h4
                      className={`font-medium mb-2 ${statusColors[status as keyof typeof statusColors]}`}
                    >
                      {statusLabels[status as keyof typeof statusLabels]} (
                      {statusGuests.length})
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {statusGuests.map((guest) => (
                        <div
                          key={guest.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="font-medium">{guest.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {guest.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {status !== "declined" && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Creado</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.created_at).toLocaleDateString("es-CO")} a las{" "}
                {new Date(event.created_at).toLocaleTimeString("es-CO")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Última modificación</p>
              <p className="text-sm text-muted-foreground">
                {new Date(event.updated_at).toLocaleDateString("es-CO")} a las{" "}
                {new Date(event.updated_at).toLocaleTimeString("es-CO")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

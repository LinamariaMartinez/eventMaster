"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Calendar, MapPin, Users, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { formatEventDate } from "@/lib/utils/date";
import { toast } from "sonner";

export default function EventsPage() {
  const { events, loading: isLoading, removeEvent } = useSupabaseEvents();
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      const success = await removeEvent(eventToDelete.id);
      if (success) {
        toast.success("Evento eliminado exitosamente");
        setEventToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error al eliminar el evento");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
              <p className="text-muted-foreground">Cargando tus eventos...</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Eventos</h1>
            <p className="text-muted-foreground">
              Gestiona todos tus eventos desde aquí
            </p>
          </div>
          <Link href="/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay eventos aún</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Comienza creando tu primer evento. Es rápido y fácil configurar.
            </p>
            <Link href="/events/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {event.description || "Sin descripción"}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatEventDate(event.date, { year: 'numeric', month: 'long', day: 'numeric' })} a las {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        Creado{" "}
                        {new Date(event.created_at).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          Editar
                        </Button>
                      </Link>
                      <Link href={`/events/${event.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/events/${event.id}/invitations`}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Invitados
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setEventToDelete({ id: event.id, title: event.title })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el evento &quot;{eventToDelete?.title}&quot;.
              Esta acción no se puede deshacer y se eliminarán también todos los invitados asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

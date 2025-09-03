"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { useToast } from "@/hooks/use-toast";
import type { Database, Json } from "@/types/database.types";

type Event = Database['public']['Tables']['events']['Row'];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;

  const { getEvent, updateEvent, removeEvent } = useSupabaseEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    settings: {} as Record<string, unknown>
  });

  useEffect(() => {
    if (eventId) {
      try {
        const eventData = getEvent(eventId);
        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title,
            description: eventData.description || "",
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            settings: (typeof eventData.settings === 'object' && eventData.settings !== null) ? eventData.settings as Record<string, unknown> : {}
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading event:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el evento",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  }, [eventId, getEvent, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    setIsSaving(true);

    try {
      const updatedEvent = await updateEvent(event.id, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        settings: formData.settings as Json
      });

      if (updatedEvent) {
        toast({
          title: "Éxito",
          description: "Evento actualizado correctamente"
        });
        router.push(`/events/${event.id}`);
      } else {
        throw new Error("No se pudo actualizar el evento");
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el evento",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    if (window.confirm("¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.")) {
      try {
        const deleted = await removeEvent(event.id);
        if (deleted) {
          toast({
            title: "Evento eliminado",
            description: "El evento ha sido eliminado correctamente"
          });
          router.push("/events");
        } else {
          throw new Error("No se pudo eliminar el evento");
        }
      } catch {
        toast({
          title: "Error",
          description: "No se pudo eliminar el evento",
          variant: "destructive"
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
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
            El evento que intentas editar no existe o ha sido eliminado.
          </p>
          <Link href="/events">
            <Button>Volver a Eventos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/events/${event.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="text-muted-foreground">Modifica los detalles del evento</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información del Evento</CardTitle>
            <CardDescription>
              Actualiza los detalles de tu evento aquí.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Conferencia Anual 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe tu evento..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Ej: Centro de Convenciones Bogotá"
                  required
                />
              </div>


              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Evento
                </Button>

                <Button type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { EventTypeSelector } from "@/components/dashboard/invitations/event-type-selector";
import { BlockTogglePanel } from "@/components/dashboard/invitations/block-toggle-panel";
import { InvitationRenderer } from "@/components/invitation-renderer";
import {
  createDefaultConfig,
  getDefaultColorScheme,
  type EventType,
  type InvitationConfig,
  type BlockConfig,
} from "@/types/invitation-blocks";
import type { Database } from "@/types/database.types";

type Event = Database['public']['Tables']['events']['Row'];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InvitationSetupPage({ params }: PageProps) {
  const router = useRouter();
  const { events, updateEvent, loading: eventsLoading } = useSupabaseEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then(p => setEventId(p.id));
  }, [params]);

  // Load event data
  useEffect(() => {
    if (!eventId || events.length === 0) return;

    const foundEvent = events.find(e => e.id === eventId);
    if (!foundEvent) {
      toast.error("Evento no encontrado");
      router.push("/events");
      return;
    }

    setEvent(foundEvent);

    // Parse existing config or create default
    try {
      const settings = foundEvent.settings as unknown as InvitationConfig;
      if (settings && 'eventType' in settings) {
        setConfig(settings);
      } else {
        // Create default config for wedding
        setConfig(createDefaultConfig('wedding'));
      }
    } catch (error) {
      console.error('Error parsing config:', error);
      setConfig(createDefaultConfig('wedding'));
    }
  }, [eventId, events, router]);

  const handleEventTypeChange = (newType: EventType) => {
    if (!config) return;

    const newColorScheme = getDefaultColorScheme(newType);
    setConfig({
      ...config,
      eventType: newType,
      colorScheme: newColorScheme,
    });
  };

  const handleBlocksChange = (newBlocks: BlockConfig[]) => {
    if (!config) return;
    setConfig({
      ...config,
      enabledBlocks: newBlocks,
    });
  };

  const handleSave = async () => {
    if (!event || !config) return;

    setSaving(true);
    try {
      const updatedEvent = await updateEvent(event.id, {
        settings: config as unknown as Database['public']['Tables']['events']['Update']['settings'],
      });

      if (updatedEvent) {
        toast.success("Configuración de invitación guardada");
        router.push(`/events/${event.id}`);
      } else {
        throw new Error("No se pudo actualizar el evento");
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (eventsLoading || !event || !config) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
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
            <Link href={`/events/${event.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Evento
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              Configurar Invitación
            </h1>
            <p className="text-gray-600 mt-1">
              {event.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-burgundy hover:bg-burgundy/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Vista Previa de Invitación</h2>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Cerrar
              </Button>
            </div>
            <InvitationRenderer
              event={event}
              config={config}
              blockData={{
                hero: {
                  title: event.title,
                  subtitle: event.description || undefined,
                  showCountdown: true,
                },
                location: {
                  address: event.location,
                },
                rsvp: {
                  allowPlusOnes: true,
                  maxGuestsPerInvite: 5,
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Configuration Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel: Configuration */}
        <div className="space-y-6">
          {/* Event Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Evento</CardTitle>
              <CardDescription>
                Selecciona el tipo de evento para aplicar el tema correspondiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventTypeSelector
                selectedType={config.eventType}
                onTypeChange={handleEventTypeChange}
              />
            </CardContent>
          </Card>

          {/* Block Toggle Panel */}
          <BlockTogglePanel
            eventType={config.eventType}
            blocks={config.enabledBlocks}
            onBlocksChange={handleBlocksChange}
          />
        </div>

        {/* Right Panel: Instructions / Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cómo Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Selecciona el Tipo de Evento</h4>
                <p>
                  Elige entre Boda, Cumpleaños o Evento Corporativo. Cada tipo tiene su propia paleta
                  de colores y bloques sugeridos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Activa/Desactiva Bloques</h4>
                <p>
                  Usa los switches para activar o desactivar cada bloque de contenido. Solo los bloques
                  activados aparecerán en la invitación pública.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Reordena los Bloques</h4>
                <p>
                  Arrastra los bloques para cambiar el orden en que aparecen en la invitación.
                  El primer bloque siempre es el Hero/Banner principal.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">4. Guarda y Comparte</h4>
                <p>
                  Una vez satisfecho con la configuración, haz clic en &quot;Guardar&quot;. Luego podrás
                  compartir la URL pública de tu invitación.
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  💡 <strong>Tip:</strong> Usa la vista previa para ver cómo se verá tu invitación
                  antes de guardar los cambios.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>URL de la Invitación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Los invitados podrán acceder a la invitación en:
                </p>
                <code className="block bg-white p-3 rounded border text-sm text-blue-600 break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/invite/{event.id}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/invite/${event.id}`);
                    toast.success("URL copiada al portapapeles");
                  }}
                >
                  Copiar URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

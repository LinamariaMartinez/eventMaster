"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { BlockContentEditor } from "@/components/dashboard/invitations/block-content-editor";
import { ColorSchemeEditor } from "@/components/dashboard/invitations/color-scheme-editor";
import { TypographyEditor, type TypographySettings } from "@/components/dashboard/invitations/typography-editor";
import { PreviewPanel } from "@/components/dashboard/invitations/preview-panel";
import { createDefaultConfig } from "@/types/invitation-blocks";
import type { EventFormData } from "@/types";
import type { Database } from "@/types/database.types";
import type {
  InvitationConfig,
  BlockType,
  ColorScheme,
} from "@/types/invitation-blocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Event = Database['public']['Tables']['events']['Row'];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditInvitationPage({ params }: PageProps) {
  const router = useRouter();
  const { events, updateEvent, loading: eventsLoading } = useSupabaseEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [blockContent, setBlockContent] = useState<Record<string, unknown>>({});
  const [typography, setTypography] = useState<TypographySettings>({
    headingFont: 'playfair',
    bodyFont: 'inter',
    fontScale: 'medium',
  });
  const [saving, setSaving] = useState(false);

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

    // Parse existing config
    try {
      const settings = foundEvent.settings as unknown as InvitationConfig & { blockContent?: Record<string, unknown> };
      if (settings && 'eventType' in settings) {
        setConfig({
          eventType: settings.eventType,
          enabledBlocks: settings.enabledBlocks,
          colorScheme: settings.colorScheme,
          customStyles: settings.customStyles,
        });
        setBlockContent(settings.blockContent || {});
      } else {
        // Create default config
        const defaultConfig = createDefaultConfig('wedding');
        setConfig(defaultConfig);
        setBlockContent({
          hero: {
            title: foundEvent.title,
            subtitle: foundEvent.description || undefined,
            showCountdown: true,
          },
          location: {
            address: foundEvent.location,
          },
          rsvp: {
            allowPlusOnes: true,
            maxGuestsPerInvite: 5,
          },
        });
      }
    } catch (error) {
      console.error('Error parsing config:', error);
      const defaultConfig = createDefaultConfig('wedding');
      setConfig(defaultConfig);
    }
  }, [eventId, events, router]);

  const handleBlockContentChange = (blockType: BlockType, data: unknown) => {
    setBlockContent({
      ...blockContent,
      [blockType]: data,
    });
  };

  const handleColorSchemeChange = (colorScheme: ColorScheme) => {
    if (!config) return;
    setConfig({
      ...config,
      colorScheme,
    });
  };

  const handleTypographyChange = (newTypography: TypographySettings) => {
    setTypography(newTypography);
  };

  const handleSave = async () => {
    if (!event || !config) return;

    setSaving(true);
    try {
      const updatedSettings = {
        ...config,
        blockContent,
        customStyles: {
          ...config.customStyles,
          headingFont: typography.headingFont,
          bodyFont: typography.bodyFont,
          fontScale: typography.fontScale,
        },
      };

      const updatedEvent = await updateEvent(event.id, {
        settings: updatedSettings as unknown as Database['public']['Tables']['events']['Update']['settings'],
      });

      if (updatedEvent) {
        toast.success("Invitación actualizada exitosamente");
        router.push(`/events/${event.id}`);
      } else {
        throw new Error("No se pudo actualizar el evento");
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Error al guardar los cambios");
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

  // Get enabled blocks
  const enabledBlocks = config.enabledBlocks.filter(block => block.enabled);

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
              Editar Invitación
            </h1>
            <p className="text-gray-600 mt-1">
              {event.title}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-burgundy hover:bg-burgundy/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      {/* Editor and Preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Editors */}
        <div className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="colors">Colores</TabsTrigger>
              <TabsTrigger value="typography">Tipografía</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editor de Contenido</CardTitle>
                  <CardDescription>
                    Edita el contenido de cada bloque habilitado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={enabledBlocks[0]?.type} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                      {enabledBlocks.slice(0, 8).map(block => (
                        <TabsTrigger key={block.type} value={block.type}>
                          {block.type}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {enabledBlocks.map(block => (
                      <TabsContent key={block.type} value={block.type} className="space-y-4 mt-4">
                        <BlockContentEditor
                          blockType={block.type}
                          data={blockContent[block.type] || {}}
                          onChange={(data) => handleBlockContentChange(block.type, data)}
                          eventId={event.id}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="mt-6">
              <ColorSchemeEditor
                colorScheme={config.colorScheme}
                onChange={handleColorSchemeChange}
              />
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="mt-6">
              <TypographyEditor
                typography={typography}
                onChange={handleTypographyChange}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-6">
          <PreviewPanel
            eventData={{
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location,
              description: event.description || undefined,
              template_id: event.template_id || undefined,
            } as EventFormData}
            invitationConfig={config}
            blockContent={blockContent}
          />
        </div>
      </div>
    </div>
  );
}

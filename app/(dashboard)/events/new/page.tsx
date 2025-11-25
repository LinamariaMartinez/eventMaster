"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/dashboard/events/event-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from "next/link";
import { EventFormData } from "@/types";
import { toast } from "sonner";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { EventTypeSelector } from "@/components/dashboard/invitations/event-type-selector";
import { BlockTogglePanel } from "@/components/dashboard/invitations/block-toggle-panel";
import { ColorSchemeEditor } from "@/components/dashboard/invitations/color-scheme-editor";
import { BlockContentEditor } from "@/components/dashboard/invitations/block-content-editor";
import { PreviewPanel } from "@/components/dashboard/invitations/preview-panel";
import {
  createDefaultConfig,
  type EventType,
  type InvitationConfig,
  type BlockConfig,
  type ColorScheme,
  type BlockType,
} from "@/types/invitation-blocks";
import type { Json } from "@/types/database.types";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { addEvent } = useSupabaseEvents();

  // Event data
  const [eventData, setEventData] = useState<EventFormData | null>(null);

  // Invitation config
  const [invitationConfig, setInvitationConfig] = useState<InvitationConfig>(
    createDefaultConfig('wedding')
  );

  // Block content data
  const [blockContent, setBlockContent] = useState<Record<string, unknown>>({});

  // Mock templates data
  const templates = [
    {
      id: "a1b2c3d4-0000-0000-0000-000000000001",
      name: "Elegante Boda",
      type: "wedding" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
    {
      id: "a1b2c3d4-0000-0000-0000-000000000002",
      name: "Fiesta de Cumpleaños",
      type: "birthday" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
    {
      id: "a1b2c3d4-0000-0000-0000-000000000003",
      name: "Evento Corporativo",
      type: "corporate" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
  ];

  const handleEventSubmit = async (data: EventFormData) => {
    setEventData(data);

    // Auto-fill block content with event data
    setBlockContent({
      hero: {
        title: data.title,
        subtitle: data.description || '',
        showCountdown: true,
      },
      location: {
        address: data.location,
      },
      rsvp: {
        allowPlusOnes: data.settings?.allowPlusOnes ?? true,
        maxGuestsPerInvite: data.settings?.maxGuestsPerInvite ?? 5,
        requireEmail: data.settings?.requireEmail ?? true,
        requirePhone: data.settings?.requirePhone ?? false,
      },
    });

    setCurrentStep(2); // Move to invitation config
  };

  const handleEventTypeChange = (newType: EventType) => {
    const newConfig = createDefaultConfig(newType);
    setInvitationConfig(newConfig);
  };

  const handleBlocksChange = (newBlocks: BlockConfig[]) => {
    setInvitationConfig({
      ...invitationConfig,
      enabledBlocks: newBlocks,
    });
  };

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setInvitationConfig({
      ...invitationConfig,
      colorScheme: newColorScheme,
    });
  };

  const handleBlockContentChange = (blockType: BlockType, data: unknown) => {
    setBlockContent({
      ...blockContent,
      [blockType]: data,
    });
  };

  const handleFinalSubmit = async () => {
    if (!eventData) return;

    setIsLoading(true);

    try {
      // Merge default block content with user-edited content
      const defaultBlockContent = {
        hero: {
          title: eventData.title,
          subtitle: eventData.description || undefined,
          showCountdown: true,
        },
        location: {
          address: eventData.location,
        },
        rsvp: {
          allowPlusOnes: true,
          maxGuestsPerInvite: 5,
        },
      };

      // Build complete settings with event data and invitation config
      const completeSettings = {
        eventType: invitationConfig.eventType,
        enabledBlocks: invitationConfig.enabledBlocks,
        colorScheme: invitationConfig.colorScheme,
        customStyles: invitationConfig.customStyles,
        blockContent: {
          ...defaultBlockContent,
          ...blockContent,
        },
      };

      const newEvent = await addEvent({
        title: eventData.title,
        description: eventData.description || null,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        template_id: eventData.template_id || null,
        whatsapp_number: eventData.whatsapp_number || null,
        settings: completeSettings as unknown as Json,
      });

      console.log('✨ Event created with WhatsApp:', eventData.whatsapp_number);

      if (newEvent) {
        toast.success("Evento e invitación creados exitosamente");
        router.push(`/events/${newEvent.id}`);
      } else {
        throw new Error("No se pudo crear el evento");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error al crear el evento");
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Eventos
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">
            Crear Nuevo Evento
          </h1>
          <p className="text-gray-600 mt-1">
            {currentStep === 1 && "Paso 1: Información del Evento"}
            {currentStep === 2 && "Paso 2: Tipo de Evento y Bloques"}
            {currentStep === 3 && "Paso 3: Contenido de Bloques"}
            {currentStep === 4 && "Paso 4: Colores y Vista Previa"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm">
          <button
            type="button"
            onClick={() => eventData && setCurrentStep(1)}
            disabled={!eventData}
            className={`transition-colors ${
              currentStep === 1
                ? "font-semibold text-burgundy"
                : eventData
                  ? "text-gray-600 hover:text-burgundy cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
            }`}
          >
            1. Información
          </button>
          <button
            type="button"
            onClick={() => eventData && setCurrentStep(2)}
            disabled={!eventData}
            className={`transition-colors ${
              currentStep === 2
                ? "font-semibold text-burgundy"
                : eventData
                  ? "text-gray-600 hover:text-burgundy cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
            }`}
          >
            2. Tipo y Bloques
          </button>
          <button
            type="button"
            onClick={() => eventData && setCurrentStep(3)}
            disabled={!eventData}
            className={`transition-colors ${
              currentStep === 3
                ? "font-semibold text-burgundy"
                : eventData
                  ? "text-gray-600 hover:text-burgundy cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
            }`}
          >
            3. Contenido
          </button>
          <button
            type="button"
            onClick={() => eventData && setCurrentStep(4)}
            disabled={!eventData}
            className={`transition-colors ${
              currentStep === 4
                ? "font-semibold text-burgundy"
                : eventData
                  ? "text-gray-600 hover:text-burgundy cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
            }`}
          >
            4. Colores
          </button>
        </div>
      </div>

      {/* Step 1: Event Form */}
      {currentStep === 1 && (
        <div className="max-w-4xl">
          <EventForm
            templates={templates}
            onSubmit={handleEventSubmit}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Step 2: Event Type and Blocks */}
      {currentStep === 2 && eventData && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Configuration */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Evento</CardTitle>
                  <CardDescription>
                    Selecciona el tipo para aplicar el tema correspondiente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EventTypeSelector
                    selectedType={invitationConfig.eventType}
                    onTypeChange={handleEventTypeChange}
                  />
                </CardContent>
              </Card>

              <BlockTogglePanel
                eventType={invitationConfig.eventType}
                blocks={invitationConfig.enabledBlocks}
                onBlocksChange={handleBlocksChange}
              />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 bg-burgundy hover:bg-burgundy/90"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-6">
              <PreviewPanel
                eventData={eventData}
                invitationConfig={invitationConfig}
                blockContent={blockContent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Block Content Editor */}
      {currentStep === 3 && eventData && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Block Editors */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Editar Contenido de Bloques</CardTitle>
                  <CardDescription>
                    Solo bloques activos. Para activar/desactivar bloques, ve al paso anterior.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitationConfig.enabledBlocks.filter(b => b.enabled).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No hay bloques activos</p>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="text-burgundy border-burgundy hover:bg-burgundy/10"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Ir a Activar Bloques
                      </Button>
                    </div>
                  ) : (
                    <Tabs defaultValue={invitationConfig.enabledBlocks.find(b => b.enabled)?.type || 'hero'} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 mb-4">
                        {invitationConfig.enabledBlocks
                          .filter(block => block.enabled)
                          .slice(0, 8)
                          .map(block => (
                            <TabsTrigger key={block.type} value={block.type} className="capitalize">
                              {block.type}
                            </TabsTrigger>
                          ))}
                      </TabsList>

                      {invitationConfig.enabledBlocks
                        .filter(block => block.enabled)
                        .map(block => (
                          <TabsContent key={block.type} value={block.type} className="space-y-4 mt-4">
                            <BlockContentEditor
                              blockType={block.type}
                              data={blockContent[block.type] || {}}
                              onChange={(data) => handleBlockContentChange(block.type, data)}
                              eventId="temp"
                            />
                          </TabsContent>
                        ))}
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 bg-burgundy hover:bg-burgundy/90"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-6">
              <PreviewPanel
                eventData={eventData}
                invitationConfig={invitationConfig}
                blockContent={blockContent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Colors and Preview */}
      {currentStep === 4 && eventData && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Color Configuration */}
            <div className="space-y-6">
              <ColorSchemeEditor
                colorScheme={invitationConfig.colorScheme}
                onChange={handleColorSchemeChange}
              />

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-burgundy hover:bg-burgundy/90"
                >
                  {isLoading ? "Creando..." : "Crear Evento"}
                  <Save className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-6">
              <PreviewPanel
                eventData={eventData}
                invitationConfig={invitationConfig}
                blockContent={blockContent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

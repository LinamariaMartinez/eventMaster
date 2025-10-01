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
import { InvitationRenderer } from "@/components/invitation-renderer";
import {
  createDefaultConfig,
  type EventType,
  type InvitationConfig,
  type BlockConfig,
  type ColorScheme,
} from "@/types/invitation-blocks";
import type { Json } from "@/types/database.types";
import { Progress } from "@/components/ui/progress";

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

  const handleFinalSubmit = async () => {
    if (!eventData) return;

    setIsLoading(true);

    try {
      // Build complete settings with event data and invitation config
      const completeSettings = {
        eventType: invitationConfig.eventType,
        enabledBlocks: invitationConfig.enabledBlocks,
        colorScheme: invitationConfig.colorScheme,
        customStyles: invitationConfig.customStyles,
        blockContent: {
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
        },
      };

      const newEvent = await addEvent({
        title: eventData.title,
        description: eventData.description || null,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        template_id: eventData.template_id || null,
        settings: completeSettings as unknown as Json,
      });

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

  const progress = (currentStep / 3) * 100;

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
            {currentStep === 3 && "Paso 3: Colores y Vista Previa"}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className={currentStep === 1 ? "font-semibold text-burgundy" : ""}>
            1. Información
          </span>
          <span className={currentStep === 2 ? "font-semibold text-burgundy" : ""}>
            2. Tipo y Bloques
          </span>
          <span className={currentStep === 3 ? "font-semibold text-burgundy" : ""}>
            3. Colores
          </span>
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
        <div className="space-y-6 max-w-4xl">
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
      )}

      {/* Step 3: Colors and Preview */}
      {currentStep === 3 && eventData && (
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
                  onClick={() => setCurrentStep(2)}
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
              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa en Vivo</CardTitle>
                  <CardDescription>
                    Los cambios de color se reflejan automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
                    <InvitationRenderer
                      event={{
                        id: 'preview',
                        user_id: 'preview',
                        title: eventData.title,
                        description: eventData.description || null,
                        date: eventData.date,
                        time: eventData.time,
                        location: eventData.location,
                        template_id: eventData.template_id || null,
                        settings: invitationConfig as unknown as Json,
                        public_url: '/invite/preview',
                        sheets_url: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }}
                      config={invitationConfig}
                      blockData={{
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
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

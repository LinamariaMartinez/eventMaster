"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Send, Eye } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Components
import { InvitationTypeSelector } from "@/components/invitations/invitation-type-selector";
import { TemplateSelector } from "@/components/invitations/template-selector";
import { VisualEditor } from "@/components/invitations/visual-editor";
import { InvitationPreview } from "@/components/invitations/invitation-preview";

// Storage
import { 
  invitationStorage, 
  invitationTemplateStorage, 
  eventStorage, 
  getInvitationTypes,
  type Invitation,
  type Event
} from "@/lib/storage";

const steps = [
  { id: "type", title: "Tipo", description: "Selecciona el tipo de invitación" },
  { id: "template", title: "Plantilla", description: "Elige un diseño base" },
  { id: "content", title: "Contenido", description: "Personaliza el texto" },
  { id: "design", title: "Diseño", description: "Ajusta colores y estilos" },
  { id: "preview", title: "Vista Previa", description: "Revisa y publica" },
];

export default function InvitationEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [invitation, setInvitation] = useState<Partial<Invitation>>({
    type: "simple",
    status: "draft",
    sentCount: 0,
    openedCount: 0,
    respondedCount: 0,
    customStyles: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      accentColor: "#3b82f6",
      fontFamily: "sans-serif",
      fontSize: "16px",
      backgroundType: "solid",
    },
    layout: {
      headerHeight: 120,
      contentPadding: 32,
      borderRadius: 12,
      shadowLevel: 2,
    },
    content: {
      hostName: "",
      eventDate: "",
      eventTime: "",
      venue: "",
      dressCode: "",
      additionalInfo: "",
    },
  });

  // Get data
  const invitationTypes = getInvitationTypes();
  const templates = invitationTemplateStorage.getAll();
  const events = eventStorage.getAll();

  // Load event data if eventId is provided
  useEffect(() => {
    const eventId = searchParams?.get("eventId");
    if (eventId) {
      const event = eventStorage.getById(eventId);
      if (event) {
        setSelectedEvent(event);
        setInvitation(prev => ({
          ...prev,
          eventId: event.id,
          title: event.title,
          description: event.description,
          content: {
            ...prev.content,
            eventDate: event.date,
            eventTime: event.time,
            venue: event.location,
          },
        }));
      }
    }
  }, [searchParams]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleTypeSelect = (type: "simple" | "premium") => {
    setInvitation(prev => ({ ...prev, type }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = invitationTemplateStorage.getById(templateId);
    if (template) {
      setInvitation(prev => ({
        ...prev,
        templateId,
        customStyles: { ...template.styles },
        layout: { ...template.layout },
      }));
    }
  };

  const handleContentUpdate = (field: string, value: string) => {
    if (field.startsWith("content.")) {
      const contentField = field.split(".")[1];
      setInvitation(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value,
        },
      }));
    } else {
      setInvitation(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleInvitationUpdate = (updates: Partial<Invitation>) => {
    setInvitation(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!invitation.eventId || !invitation.templateId) {
      toast({
        title: "Datos incompletos",
        description: "Por favor selecciona un evento y una plantilla",
        variant: "destructive",
      });
      return;
    }

    try {
      const invitationData = {
        ...invitation,
        status: publish ? "published" : "draft",
      } as Omit<Invitation, "id" | "createdAt" | "updatedAt">;

      const savedInvitation = invitationStorage.add(invitationData);

      toast({
        title: publish ? "¡Invitación publicada!" : "Invitación guardada",
        description: publish 
          ? "Tu invitación está lista para enviar" 
          : "Los cambios han sido guardados como borrador",
      });

      router.push(`/invitations/${savedInvitation.id}`);
    } catch (error) {
      console.error("Error saving invitation:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la invitación",
        variant: "destructive",
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Type selection
        return invitation.type;
      case 1: // Template selection
        return invitation.templateId;
      case 2: // Content
        return invitation.title && invitation.eventId;
      case 3: // Design
        return true; // Always can proceed from design
      case 4: // Preview
        return true;
      default:
        return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/invitations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Invitaciones
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Editor de Invitaciones</h1>
              <p className="text-muted-foreground mt-1">
                Crea invitaciones personalizadas para tu evento
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave(false)}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Borrador
            </Button>
            <Button onClick={() => handleSave(true)} disabled={!canProceed()}>
              <Send className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex flex-col items-center text-center cursor-pointer transition-colors ${
                  index === currentStep
                    ? "text-primary"
                    : index < currentStep
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mb-2 ${
                    index === currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index < currentStep
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs opacity-70">{step.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Step 0: Type Selection */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Invitación</CardTitle>
                  <CardDescription>
                    Elige entre nuestros planes Simple o Premium
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InvitationTypeSelector
                    selectedType={invitation.type || null}
                    onTypeSelect={handleTypeSelect}
                    invitationTypes={invitationTypes}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 1: Template Selection */}
            {currentStep === 1 && invitation.type && (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Plantilla</CardTitle>
                  <CardDescription>
                    Elige un diseño base para tu invitación {invitation.type === "premium" ? "Premium" : "Simple"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateSelector
                    selectedTemplate={invitation.templateId || null}
                    onTemplateSelect={handleTemplateSelect}
                    templates={templates}
                    selectedType={invitation.type}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Evento</CardTitle>
                    <CardDescription>
                      Completa los detalles de tu evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventId">Evento</Label>
                      <Select
                        value={invitation.eventId || ""}
                        onValueChange={(value) => {
                          const event = eventStorage.getById(value);
                          if (event) {
                            setSelectedEvent(event);
                            setInvitation(prev => ({
                              ...prev,
                              eventId: event.id,
                              title: event.title,
                              description: event.description,
                              content: {
                                ...prev.content,
                                eventDate: event.date,
                                eventTime: event.time,
                                venue: event.location,
                              },
                            }));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Título de la invitación</Label>
                      <Input
                        id="title"
                        value={invitation.title || ""}
                        onChange={(e) => handleContentUpdate("title", e.target.value)}
                        placeholder="Ej: Te invitamos a nuestra boda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={invitation.description || ""}
                        onChange={(e) => handleContentUpdate("description", e.target.value)}
                        placeholder="Descripción del evento..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostName">Nombre del anfitrión</Label>
                      <Input
                        id="hostName"
                        value={invitation.content?.hostName || ""}
                        onChange={(e) => handleContentUpdate("content.hostName", e.target.value)}
                        placeholder="Tu nombre o nombres"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dressCode">Código de vestimenta (opcional)</Label>
                      <Input
                        id="dressCode"
                        value={invitation.content?.dressCode || ""}
                        onChange={(e) => handleContentUpdate("content.dressCode", e.target.value)}
                        placeholder="Ej: Etiqueta formal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Información adicional</Label>
                      <Textarea
                        id="additionalInfo"
                        value={invitation.content?.additionalInfo || ""}
                        onChange={(e) => handleContentUpdate("content.additionalInfo", e.target.value)}
                        placeholder="Cualquier información extra..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Design */}
            {currentStep === 3 && (
              <VisualEditor
                invitation={invitation}
                onUpdate={handleInvitationUpdate}
                isPremium={invitation.type === "premium"}
              />
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Publicar Invitación</CardTitle>
                  <CardDescription>
                    Tu invitación está lista. Publícala para generar la URL pública.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button onClick={() => handleSave(true)} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Publicar Invitación
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Una vez publicada, podrás compartir la URL con tus invitados.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1 || !canProceed()}
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-6">
            <InvitationPreview
              invitation={invitation}
              event={selectedEvent}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
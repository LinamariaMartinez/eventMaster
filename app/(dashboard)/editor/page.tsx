"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { TemplateSelector } from "@/components/dashboard/invitations/template-selector";
import { VisualEditor } from "@/components/dashboard/invitations/visual-editor";
import { StylePanel } from "@/components/dashboard/invitations/style-panel";
import { Preview } from "@/components/dashboard/invitations/preview";
import { ActionControls } from "@/components/dashboard/invitations/action-controls";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";

export interface InvitationTemplate {
  id: string;
  name: string;
  thumbnail: string;
  content: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    backgroundColor: string;
    textColor: string;
    font: string;
  };
}

export interface InvitationData {
  template: InvitationTemplate | null;
  content: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    guestName: string;
    eventUrl: string;
  };
  styles: {
    backgroundColor: string;
    textColor: string;
    font: string;
    fontSize: string;
    alignment: string;
    backgroundType: "solid" | "gradient";
    gradientFrom: string;
    gradientTo: string;
  };
  images: Array<{
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export default function InvitacionesPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [invitationData, setInvitationData] = useState<InvitationData>({
    template: null,
    content: {
      title: "Título del Evento",
      description: "Descripción del evento aquí...",
      date: "2024-12-25",
      time: "19:00",
      location: "Lugar del evento",
      guestName: "{nombre_invitado}",
      eventUrl: "{url_evento}",
    },
    styles: {
      backgroundColor: "#f5f5dc",
      textColor: "#8b1538",
      font: "Inter",
      fontSize: "base",
      alignment: "center",
      backgroundType: "solid",
      gradientFrom: "#f5f5dc",
      gradientTo: "#e6d7b7",
    },
    images: [],
  });

  const handleTemplateSelect = (template: InvitationTemplate) => {
    setInvitationData((prev) => ({
      ...prev,
      template,
      content: {
        ...prev.content,
        title: template.content.title,
        description: template.content.description,
        date: template.content.date,
        time: template.content.time,
        location: template.content.location,
      },
      styles: {
        ...prev.styles,
        backgroundColor: template.content.backgroundColor,
        textColor: template.content.textColor,
        font: template.content.font,
      },
    }));
  };

  const handleContentChange = (field: string, value: string) => {
    setInvitationData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  const handleStyleChange = (field: string, value: string) => {
    setInvitationData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [field]: value,
      },
    }));
  };

  const handleImageAdd = (image: {
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setInvitationData((prev) => ({
      ...prev,
      images: [...prev.images, image],
    }));
  };

  const handleImageUpdate = (
    imageId: string,
    updates: Partial<{ x: number; y: number; width: number; height: number }>,
  ) => {
    setInvitationData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === imageId ? { ...img, ...updates } : img,
      ),
    }));
  };

  const handleImageRemove = (imageId: string) => {
    setInvitationData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Editor de Invitaciones
            </h1>
            <p className="text-muted-foreground">
              Crea y personaliza invitaciones para tus eventos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              {showPreview ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showPreview ? "Ocultar Vista Previa" : "Mostrar Vista Previa"}
            </Button>
            <ActionControls
              invitationData={invitationData}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Templates */}
          <div className="w-80 border-r border-border overflow-y-auto">
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
          </div>

          {/* Center Panel - Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <VisualEditor
                invitationData={invitationData}
                onContentChange={handleContentChange}
                onImageAdd={handleImageAdd}
                onImageUpdate={handleImageUpdate}
                onImageRemove={handleImageRemove}
              />
            </div>
          </div>

          {/* Right Panel - Styles */}
          <div className="w-80 border-l border-border overflow-y-auto">
            <StylePanel
              styles={invitationData.styles}
              onStyleChange={handleStyleChange}
            />
          </div>

          {/* Preview Panel (conditional) */}
          {showPreview && (
            <>
              <Separator orientation="vertical" />
              <div className="w-96 overflow-y-auto">
                <Preview
                  invitationData={invitationData}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

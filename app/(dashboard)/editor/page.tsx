"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Download, Send } from "lucide-react";

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

export default function InvitationEditorPage() {
  const [activeTab, setActiveTab] = useState("editor");
  const [invitationData, setInvitationData] = useState({
    title: "Cena de Gala Empresarial 2025",
    description: "Te invitamos cordialmente a nuestra cena de gala anual. Una noche especial para celebrar los logros del año y fortalecer los lazos empresariales.",
    date: "2025-03-15",
    time: "19:00",
    location: "Hotel Tequendama, Salón Bolívar - Bogotá",
    guestName: "[Nombre del Invitado]",
    dresscode: "Etiqueta formal",
    template: "elegant",
    backgroundColor: "#1a1b23",
    textColor: "#f5f5f5",
    accentColor: "#d4af37"
  });

  const handleInputChange = (field: string, value: string) => {
    setInvitationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const templates = [
    { id: "elegant", name: "Elegante", colors: { bg: "#1a1b23", text: "#f5f5f5", accent: "#d4af37" } },
    { id: "modern", name: "Moderno", colors: { bg: "#ffffff", text: "#2d3748", accent: "#3182ce" } },
    { id: "classic", name: "Clásico", colors: { bg: "#f7fafc", text: "#2d3748", accent: "#e53e3e" } },
    { id: "vibrant", name: "Vibrante", colors: { bg: "#667eea", text: "#ffffff", accent: "#f093fb" } }
  ];

  const InvitationPreview = () => {
    const currentTemplate = templates.find(t => t.id === invitationData.template);
    const colors = currentTemplate?.colors || templates[0].colors;
    
    return (
      <div 
        className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg text-center"
        style={{ 
          backgroundColor: colors.bg,
          color: colors.text,
          border: `2px solid ${colors.accent}`
        }}
      >
        <div className="mb-6">
          <div 
            className="w-16 h-1 mx-auto mb-4 rounded"
            style={{ backgroundColor: colors.accent }}
          ></div>
          <h1 className="text-2xl font-bold mb-2">{invitationData.title}</h1>
          <p className="text-sm opacity-90 leading-relaxed mb-6">{invitationData.description}</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2">
            <strong>Fecha:</strong> {new Date(invitationData.date).toLocaleDateString('es-CO')}
          </div>
          <div className="flex items-center justify-center gap-2">
            <strong>Hora:</strong> {invitationData.time}
          </div>
          <div className="flex items-center justify-center gap-2 text-center">
            <strong>Lugar:</strong> {invitationData.location}
          </div>
          {invitationData.dresscode && (
            <div className="flex items-center justify-center gap-2">
              <strong>Código de vestimenta:</strong> {invitationData.dresscode}
            </div>
          )}
        </div>
        
        <div className="border-t pt-4" style={{ borderColor: colors.accent }}>
          <p className="text-sm font-medium">Estimado/a {invitationData.guestName}</p>
          <p className="text-xs opacity-75 mt-2">Esperamos contar con tu presencia</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editor de Invitaciones</h2>
          <p className="text-muted-foreground">Crea y personaliza invitaciones para tus eventos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">
            <Edit className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Contenido de la Invitación</CardTitle>
                <CardDescription>
                  Edita los detalles de tu evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Evento</Label>
                  <Input
                    id="title"
                    value={invitationData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Cena de Gala 2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={invitationData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descripción del evento..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={invitationData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={invitationData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={invitationData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Lugar del evento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dresscode">Código de Vestimenta (Opcional)</Label>
                  <Input
                    id="dresscode"
                    value={invitationData.dresscode}
                    onChange={(e) => handleInputChange('dresscode', e.target.value)}
                    placeholder="Ej: Etiqueta formal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestName">Nombre del Invitado</Label>
                  <Input
                    id="guestName"
                    value={invitationData.guestName}
                    onChange={(e) => handleInputChange('guestName', e.target.value)}
                    placeholder="[Nombre del Invitado]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template & Style Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Diseño y Estilo</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de tu invitación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Plantilla</Label>
                  <Select 
                    value={invitationData.template} 
                    onValueChange={(value) => {
                      const template = templates.find(t => t.id === value);
                      if (template) {
                        handleInputChange('template', value);
                        handleInputChange('backgroundColor', template.colors.bg);
                        handleInputChange('textColor', template.colors.text);
                        handleInputChange('accentColor', template.colors.accent);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plantilla" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Fondo</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={invitationData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Texto</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={invitationData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Acento</Label>
                    <Input
                      id="accentColor"
                      type="color"
                      value={invitationData.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Vista previa en miniatura</h4>
                  <div className="border rounded p-4 bg-muted/30">
                    <div className="w-32 mx-auto">
                      <InvitationPreview />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de la Invitación</CardTitle>
              <CardDescription>
                Así se verá tu invitación final
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-8">
                <InvitationPreview />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

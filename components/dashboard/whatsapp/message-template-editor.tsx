"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface MessageTemplateEditorProps {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  hostName?: string;
  onTemplateChange?: (template: string) => void;
  initialTemplate?: string;
}

const DEFAULT_TEMPLATE = `¡Hola {nombre}! 👋

Te invitamos a nuestro evento:

🎉 *{evento}*
📅 Fecha: {fecha}
🕒 Hora: {hora}
📍 Lugar: {ubicacion}

Para ver todos los detalles y confirmar tu asistencia, visita:
{url}

¡Esperamos verte allí!

Saludos,
{anfitrion}`;

const VARIABLES = [
  { key: '{nombre}', description: 'Nombre del invitado' },
  { key: '{evento}', description: 'Nombre del evento' },
  { key: '{fecha}', description: 'Fecha del evento' },
  { key: '{hora}', description: 'Hora del evento' },
  { key: '{ubicacion}', description: 'Ubicación del evento' },
  { key: '{anfitrion}', description: 'Nombre del anfitrión' },
  { key: '{url}', description: 'URL de la invitación' },
];

export function MessageTemplateEditor({
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  hostName = "Organizador",
  onTemplateChange,
  initialTemplate,
}: MessageTemplateEditorProps) {
  const [template, setTemplate] = useState(initialTemplate || DEFAULT_TEMPLATE);
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate preview with example data
    const examplePreview = template
      .replace(/{nombre}/g, 'Juan Pérez')
      .replace(/{evento}/g, eventTitle)
      .replace(/{fecha}/g, eventDate)
      .replace(/{hora}/g, eventTime)
      .replace(/{ubicacion}/g, eventLocation)
      .replace(/{anfitrion}/g, hostName)
      .replace(/{url}/g, 'https://invitacion.com/abc123');

    setPreview(examplePreview);

    if (onTemplateChange) {
      onTemplateChange(template);
    }
  }, [template, eventTitle, eventDate, eventTime, eventLocation, hostName, onTemplateChange]);

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
  };

  const insertVariable = (variable: string) => {
    setTemplate(prev => prev + variable);
  };

  const copyPreview = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      toast.success('Vista previa copiada');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const resetTemplate = () => {
    setTemplate(DEFAULT_TEMPLATE);
    toast.success('Plantilla restablecida');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Editor de Plantilla de WhatsApp
          </CardTitle>
          <CardDescription>
            Personaliza el mensaje que se enviará a tus invitados. Usa las variables para incluir información dinámica.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Variables */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Variables Disponibles</Label>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map(({ key, description }) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(key)}
                  className="text-xs"
                  title={description}
                >
                  {key}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Haz clic en una variable para insertarla en la plantilla
            </p>
          </div>

          {/* Template Editor */}
          <div>
            <Label htmlFor="template" className="text-sm font-semibold">
              Plantilla de Mensaje
            </Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              placeholder="Escribe tu plantilla aquí..."
              className="min-h-[300px] font-mono text-sm mt-2"
            />
            <div className="flex justify-end mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetTemplate}
              >
                Restablecer Plantilla
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Vista Previa</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyPreview}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Así se verá el mensaje con datos de ejemplo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                {preview}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Count */}
      <div className="text-sm text-muted-foreground text-right">
        {template.length} caracteres
        {template.length > 1600 && (
          <span className="text-orange-600 ml-2">
            ⚠️ El mensaje es largo, considera reducirlo
          </span>
        )}
      </div>
    </div>
  );
}

export function generateWhatsAppMessage(
  template: string,
  guestName: string,
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  eventLocation: string,
  hostName: string,
  invitationUrl: string
): string {
  return template
    .replace(/{nombre}/g, guestName)
    .replace(/{evento}/g, eventTitle)
    .replace(/{fecha}/g, eventDate)
    .replace(/{hora}/g, eventTime)
    .replace(/{ubicacion}/g, eventLocation)
    .replace(/{anfitrion}/g, hostName)
    .replace(/{url}/g, invitationUrl);
}

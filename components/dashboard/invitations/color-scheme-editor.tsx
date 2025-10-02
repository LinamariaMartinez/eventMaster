"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ColorScheme } from "@/types/invitation-blocks";
import { Palette } from "lucide-react";

interface ColorSchemeEditorProps {
  colorScheme: ColorScheme;
  onChange: (colorScheme: ColorScheme) => void;
}

export function ColorSchemeEditor({ colorScheme, onChange }: ColorSchemeEditorProps) {
  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onChange({
      ...colorScheme,
      [key]: value,
    });
  };

  const colorFields: Array<{
    key: keyof ColorScheme;
    label: string;
    description: string;
    example: string;
  }> = [
    {
      key: 'primary',
      label: 'Color Primario',
      description: 'Títulos principales, botones y elementos destacados',
      example: 'Ej: #8B4F4F (Burgundy)'
    },
    {
      key: 'secondary',
      label: 'Color Secundario',
      description: 'Fondos de secciones y áreas de contenido',
      example: 'Ej: #F5E6D3 (Cream)'
    },
    {
      key: 'accent',
      label: 'Color de Acento',
      description: 'Líneas divisoras, iconos y detalles decorativos',
      example: 'Ej: #D4AF37 (Gold)'
    },
    {
      key: 'background',
      label: 'Fondo Principal',
      description: 'Color de fondo general de la invitación',
      example: 'Ej: #FFFFFF (Blanco)'
    },
    {
      key: 'text',
      label: 'Texto Principal',
      description: 'Color del texto de contenido principal',
      example: 'Ej: #2D2D2D (Negro suave)'
    },
    {
      key: 'textLight',
      label: 'Texto Secundario',
      description: 'Descripciones, subtítulos y texto de apoyo',
      example: 'Ej: #6B6B6B (Gris)'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-burgundy" />
          <CardTitle>Paleta de Colores</CardTitle>
        </div>
        <CardDescription>
          Personaliza cada color para crear el estilo perfecto de tu invitación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Palette */}
        <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
          {colorFields.slice(0, 3).map(({ key, label }) => (
            <div key={key} className="flex-1">
              <div
                className="h-16 rounded-md border-2 border-white shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: colorScheme[key] }}
              />
              <p className="text-xs text-center mt-2 text-gray-600">{label}</p>
            </div>
          ))}
        </div>

        {/* Color Editors */}
        <div className="space-y-5">
          {colorFields.map(({ key, label, description, example }) => (
            <div key={key} className="space-y-2 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <Label htmlFor={`color-${key}`} className="text-base font-semibold">
                  {label}
                </Label>
                <span className="text-xs font-mono text-gray-500">{colorScheme[key]}</span>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    id={`color-${key}`}
                    type="color"
                    value={colorScheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-16 h-16 p-1 cursor-pointer border-2"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={colorScheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="font-mono"
                    placeholder="#000000"
                  />
                  <p className="text-xs text-gray-400 mt-1">{example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

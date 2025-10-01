"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ColorScheme } from "@/types/invitation-blocks";

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

  const colorFields: Array<{ key: keyof ColorScheme; label: string; description: string }> = [
    { key: 'primary', label: 'Color Primario', description: 'Color principal del tema' },
    { key: 'secondary', label: 'Color Secundario', description: 'Color de fondo y acentos' },
    { key: 'accent', label: 'Color de Acento', description: 'Detalles y elementos destacados' },
    { key: 'background', label: 'Fondo', description: 'Color de fondo de la página' },
    { key: 'text', label: 'Texto', description: 'Color del texto principal' },
    { key: 'textLight', label: 'Texto Secundario', description: 'Color del texto secundario' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Colores Personalizados</CardTitle>
        <CardDescription>
          Personaliza los colores de tu invitación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {colorFields.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`color-${key}`}>{label}</Label>
            <div className="flex items-center gap-3">
              <Input
                id={`color-${key}`}
                type="color"
                value={colorScheme[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colorScheme[key]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

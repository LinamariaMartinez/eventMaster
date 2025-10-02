"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  fontScale: 'small' | 'medium' | 'large';
}

interface TypographyEditorProps {
  typography: TypographySettings;
  onChange: (typography: TypographySettings) => void;
}

const fontOptions = [
  { value: 'playfair', label: 'Playfair Display', family: '"Playfair Display", serif', style: 'Elegante y clásico' },
  { value: 'montserrat', label: 'Montserrat', family: '"Montserrat", sans-serif', style: 'Moderno y limpio' },
  { value: 'lora', label: 'Lora', family: '"Lora", serif', style: 'Tradicional y legible' },
  { value: 'raleway', label: 'Raleway', family: '"Raleway", sans-serif', style: 'Sofisticado y aireado' },
  { value: 'merriweather', label: 'Merriweather', family: '"Merriweather", serif', style: 'Cálido y amigable' },
  { value: 'inter', label: 'Inter', family: '"Inter", sans-serif', style: 'Corporativo y profesional' },
  { value: 'cormorant', label: 'Cormorant', family: '"Cormorant", serif', style: 'Romántico y delicado' },
  { value: 'poppins', label: 'Poppins', family: '"Poppins", sans-serif', style: 'Geométrico y balanceado' },
];

export function TypographyEditor({ typography, onChange }: TypographyEditorProps) {
  const handleHeadingFontChange = (value: string) => {
    onChange({ ...typography, headingFont: value });
  };

  const handleBodyFontChange = (value: string) => {
    onChange({ ...typography, bodyFont: value });
  };

  const handleFontScaleChange = (value: 'small' | 'medium' | 'large') => {
    onChange({ ...typography, fontScale: value });
  };

  const getSelectedFont = (value: string) => fontOptions.find(f => f.value === value);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-burgundy" />
          <CardTitle>Tipografía</CardTitle>
        </div>
        <CardDescription>
          Define la jerarquía visual con fuentes armónicas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heading Font */}
        <div className="space-y-3 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
          <Label className="text-base font-semibold">Fuente para Títulos</Label>
          <p className="text-sm text-gray-600">
            Se usa en títulos principales, nombres y encabezados importantes
          </p>
          <Select value={typography.headingFont} onValueChange={handleHeadingFontChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  <div className="flex flex-col">
                    <span style={{ fontFamily: font.family }} className="text-base">
                      {font.label}
                    </span>
                    <span className="text-xs text-gray-500">{font.style}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSelectedFont(typography.headingFont) && (
            <div
              className="p-4 bg-gray-50 rounded text-center"
              style={{ fontFamily: getSelectedFont(typography.headingFont)!.family }}
            >
              <p className="text-3xl font-bold">María & Carlos</p>
              <p className="text-sm text-gray-500 mt-2">{getSelectedFont(typography.headingFont)!.style}</p>
            </div>
          )}
        </div>

        {/* Body Font */}
        <div className="space-y-3 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
          <Label className="text-base font-semibold">Fuente para Texto</Label>
          <p className="text-sm text-gray-600">
            Se usa en descripciones, contenido general y texto de apoyo
          </p>
          <Select value={typography.bodyFont} onValueChange={handleBodyFontChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  <div className="flex flex-col">
                    <span style={{ fontFamily: font.family }} className="text-base">
                      {font.label}
                    </span>
                    <span className="text-xs text-gray-500">{font.style}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getSelectedFont(typography.bodyFont) && (
            <div
              className="p-4 bg-gray-50 rounded"
              style={{ fontFamily: getSelectedFont(typography.bodyFont)!.family }}
            >
              <p className="text-base">
                Nos encantaría que nos acompañes en este día tan especial.
                Tu presencia hará nuestra celebración aún más memorable.
              </p>
              <p className="text-sm text-gray-500 mt-2">{getSelectedFont(typography.bodyFont)!.style}</p>
            </div>
          )}
        </div>

        {/* Font Scale */}
        <div className="space-y-3 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
          <Label className="text-base font-semibold">Tamaño de Fuente</Label>
          <p className="text-sm text-gray-600">
            Ajusta el tamaño general del texto
          </p>
          <Select value={typography.fontScale} onValueChange={handleFontScaleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                <div className="flex flex-col">
                  <span>Pequeño</span>
                  <span className="text-xs text-gray-500">Compacto y elegante</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex flex-col">
                  <span>Mediano</span>
                  <span className="text-xs text-gray-500">Balance perfecto (recomendado)</span>
                </div>
              </SelectItem>
              <SelectItem value="large">
                <div className="flex flex-col">
                  <span>Grande</span>
                  <span className="text-xs text-gray-500">Fácil de leer</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

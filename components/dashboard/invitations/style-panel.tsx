"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Palette, Type, AlignLeft, AlignCenter, AlignRight, Paintbrush, Brain as Gradient } from "lucide-react"

interface StylePanelProps {
  styles: {
    backgroundColor: string
    textColor: string
    font: string
    fontSize: string
    alignment: string
    backgroundType: "solid" | "gradient"
    gradientFrom: string
    gradientTo: string
  }
  onStyleChange: (field: string, value: string) => void
}

const colorPalette = [
  { name: "Crema", value: "#f5f5dc" },
  { name: "Beige", value: "#e6d7b7" },
  { name: "Burgundy", value: "#8b1538" },
  { name: "Burgundy Oscuro", value: "#6b1028" },
  { name: "Blanco", value: "#ffffff" },
  { name: "Negro", value: "#000000" },
  { name: "Gris Claro", value: "#f8f9fa" },
  { name: "Gris", value: "#6c757d" },
]

const fonts = [
  { name: "Inter (Sans-serif)", value: "Inter, sans-serif" },
  { name: "Georgia (Serif)", value: "Georgia, serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Crimson Text", value: "Crimson Text, serif" },
]

const fontSizes = [
  { name: "Pequeño", value: "sm" },
  { name: "Normal", value: "base" },
  { name: "Grande", value: "lg" },
  { name: "Extra Grande", value: "xl" },
]

export function StylePanel({ styles, onStyleChange }: StylePanelProps) {
  const ColorPicker = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: string
    onChange: (color: string) => void
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-4 gap-2">
        {colorPalette.map((color) => (
          <button
            key={color.value}
            className={`w-8 h-8 rounded-md border-2 transition-all hover:scale-110 ${
              value === color.value ? "border-primary ring-2 ring-primary/20" : "border-border"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onChange(color.value)}
            title={color.name}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-border cursor-pointer"
        />
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </div>
    </div>
  )

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Estilos</h3>
        <p className="text-sm text-muted-foreground">Personaliza la apariencia de tu invitación</p>
      </div>

      {/* Background */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Fondo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={styles.backgroundType === "solid" ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange("backgroundType", "solid")}
              className="flex-1"
            >
              <Palette className="h-4 w-4 mr-1" />
              Sólido
            </Button>
            <Button
              variant={styles.backgroundType === "gradient" ? "default" : "outline"}
              size="sm"
              onClick={() => onStyleChange("backgroundType", "gradient")}
              className="flex-1"
            >
              <Gradient className="h-4 w-4 mr-1" />
              Gradiente
            </Button>
          </div>

          {styles.backgroundType === "solid" ? (
            <ColorPicker
              label="Color de Fondo"
              value={styles.backgroundColor}
              onChange={(color) => onStyleChange("backgroundColor", color)}
            />
          ) : (
            <div className="space-y-4">
              <ColorPicker
                label="Color Inicial"
                value={styles.gradientFrom}
                onChange={(color) => onStyleChange("gradientFrom", color)}
              />
              <ColorPicker
                label="Color Final"
                value={styles.gradientTo}
                onChange={(color) => onStyleChange("gradientTo", color)}
              />
              <div
                className="w-full h-8 rounded-md border border-border"
                style={{
                  background: `linear-gradient(135deg, ${styles.gradientFrom}, ${styles.gradientTo})`,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Type className="h-4 w-4" />
            Tipografía
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            label="Color del Texto"
            value={styles.textColor}
            onChange={(color) => onStyleChange("textColor", color)}
          />

          <div>
            <Label className="text-sm font-medium">Fuente</Label>
            <Select value={styles.font} onValueChange={(value) => onStyleChange("font", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Tamaño de Fuente</Label>
            <Select value={styles.fontSize} onValueChange={(value) => onStyleChange("fontSize", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Alineación</Label>
            <div className="flex gap-1">
              <Button
                variant={styles.alignment === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => onStyleChange("alignment", "left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={styles.alignment === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => onStyleChange("alignment", "center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={styles.alignment === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => onStyleChange("alignment", "right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Estilos Predefinidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                onStyleChange("backgroundColor", "#f5f5dc")
                onStyleChange("textColor", "#8b1538")
                onStyleChange("font", "Georgia, serif")
                onStyleChange("backgroundType", "solid")
              }}
            >
              <Badge className="mr-2 bg-[#f5f5dc] text-[#8b1538]">Clásico</Badge>
              Elegante y tradicional
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                onStyleChange("gradientFrom", "#f5f5dc")
                onStyleChange("gradientTo", "#e6d7b7")
                onStyleChange("textColor", "#8b1538")
                onStyleChange("font", "Inter, sans-serif")
                onStyleChange("backgroundType", "gradient")
              }}
            >
              <Badge className="mr-2 bg-gradient-to-r from-[#f5f5dc] to-[#e6d7b7] text-[#8b1538]">Moderno</Badge>
              Gradiente suave
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                onStyleChange("backgroundColor", "#ffffff")
                onStyleChange("textColor", "#000000")
                onStyleChange("font", "Inter, sans-serif")
                onStyleChange("backgroundType", "solid")
              }}
            >
              <Badge className="mr-2 bg-white text-black border">Minimalista</Badge>
              Limpio y simple
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

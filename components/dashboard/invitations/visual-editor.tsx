"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Type, Calendar, Clock, MapPin, User, Link, Plus, Move, Trash2 } from "lucide-react"
import type { InvitationData } from "@/app/(dashboard)/invitations/page"

interface VisualEditorProps {
  invitationData: InvitationData
  onContentChange: (field: string, value: string) => void
  onImageAdd: (image: { id: string; url: string; x: number; y: number; width: number; height: number }) => void
  onImageUpdate: (imageId: string, updates: Partial<{ x: number; y: number; width: number; height: number }>) => void
  onImageRemove: (imageId: string) => void
}

const dynamicFields = [
  { key: "guestName", label: "Nombre del Invitado", icon: User, value: "{nombre_invitado}" },
  { key: "eventUrl", label: "URL del Evento", icon: Link, value: "{url_evento}" },
  { key: "date", label: "Fecha", icon: Calendar, value: "{fecha}" },
  { key: "time", label: "Hora", icon: Clock, value: "{hora}" },
  { key: "location", label: "Lugar", icon: MapPin, value: "{lugar}" },
]

export function VisualEditor({
  invitationData,
  onContentChange,
  onImageAdd,
  onImageUpdate,
  onImageRemove,
}: VisualEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const newImage = {
          id: Date.now().toString(),
          url: imageUrl,
          x: 50,
          y: 50,
          width: 200,
          height: 150,
        }
        onImageAdd(newImage)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertDynamicField = (field: string, value: string) => {
    // Insert at cursor position in the currently focused field
    // For now, we'll append to the description
    const currentDescription = invitationData.content.description
    onContentChange("description", `${currentDescription} ${value}`)
  }

  const getBackgroundStyle = () => {
    if (invitationData.styles.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${invitationData.styles.gradientFrom}, ${invitationData.styles.gradientTo})`,
      }
    }
    return {
      backgroundColor: invitationData.styles.backgroundColor,
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Dynamic Fields Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Campos Dinámicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dynamicFields.map((field) => (
              <Badge
                key={field.key}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => insertDynamicField(field.key, field.value)}
              >
                <field.icon className="h-3 w-3 mr-1" />
                {field.label}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Haz clic en un campo para insertarlo en tu invitación</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              Contenido de la Invitación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={invitationData.content.title}
                onChange={(e) => onContentChange("title", e.target.value)}
                placeholder="Título del evento"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={invitationData.content.description}
                onChange={(e) => onContentChange("description", e.target.value)}
                placeholder="Descripción del evento"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={invitationData.content.date}
                  onChange={(e) => onContentChange("date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={invitationData.content.time}
                  onChange={(e) => onContentChange("time", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Lugar</Label>
              <Input
                id="location"
                value={invitationData.content.location}
                onChange={(e) => onContentChange("location", e.target.value)}
                placeholder="Lugar del evento"
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Imágenes y Logos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Imagen
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {invitationData.images.length > 0 && (
              <div className="space-y-2">
                <Label>Imágenes en la invitación</Label>
                {invitationData.images.map((image) => (
                  <div
                    key={image.id}
                    className={`flex items-center gap-3 p-2 rounded-md border ${
                      selectedImage === image.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Imagen {image.id}</p>
                      <p className="text-muted-foreground">
                        {image.width}x{image.height}px
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedImage(image.id)}>
                        <Move className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onImageRemove(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Vista Previa en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-lg border-2 border-dashed border-border overflow-hidden"
            style={getBackgroundStyle()}
          >
            {/* Background Images */}
            {invitationData.images.map((image) => (
              <div
                key={image.id}
                className={`absolute cursor-move ${selectedImage === image.id ? "ring-2 ring-primary" : ""}`}
                style={{
                  left: `${image.x}px`,
                  top: `${image.y}px`,
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                }}
                onClick={() => setSelectedImage(image.id)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt="Invitation element"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}

            {/* Text Content */}
            <div
              className={`absolute inset-4 flex flex-col justify-center text-${invitationData.styles.alignment}`}
              style={{
                color: invitationData.styles.textColor,
                fontFamily: invitationData.styles.font,
              }}
            >
              <h1
                className={`font-bold mb-4 text-${invitationData.styles.fontSize === "base" ? "xl" : invitationData.styles.fontSize}`}
              >
                {invitationData.content.title}
              </h1>
              <p className="mb-4 text-sm leading-relaxed">{invitationData.content.description}</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {invitationData.content.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {invitationData.content.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {invitationData.content.location}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

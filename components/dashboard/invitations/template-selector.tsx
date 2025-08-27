"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Palette } from "lucide-react"
import Image from "next/image"
import type { InvitationTemplate } from "@/app/(dashboard)/invitations/page"

const templates: InvitationTemplate[] = [
  {
    id: "1",
    name: "Elegante Clásico",
    thumbnail: "/elegant-classic-invitation-burgundy-cream.png",
    content: {
      title: "Celebración Especial",
      description: "Te invitamos a acompañarnos en esta ocasión única",
      date: "2024-12-25",
      time: "19:00",
      location: "Salón de Eventos",
      backgroundColor: "#f5f5dc",
      textColor: "#8b1538",
      font: "serif",
    },
  },
  {
    id: "2",
    name: "Moderno Minimalista",
    thumbnail: "/modern-minimalist-invitation-clean-design.png",
    content: {
      title: "Evento Corporativo",
      description: "Únete a nosotros para una experiencia memorable",
      date: "2024-12-30",
      time: "18:00",
      location: "Centro de Convenciones",
      backgroundColor: "#ffffff",
      textColor: "#8b1538",
      font: "sans-serif",
    },
  },
  {
    id: "3",
    name: "Festivo Colorido",
    thumbnail: "/festive-colorful-invitation-celebration.png",
    content: {
      title: "¡Gran Celebración!",
      description: "Una noche llena de diversión y sorpresas te espera",
      date: "2024-12-31",
      time: "21:00",
      location: "Club Social",
      backgroundColor: "#ffd700",
      textColor: "#8b1538",
      font: "sans-serif",
    },
  },
  {
    id: "4",
    name: "Romántico Vintage",
    thumbnail: "/romantic-vintage-invitation-floral-design.png",
    content: {
      title: "Cena Romántica",
      description: "Una velada especial bajo las estrellas",
      date: "2024-12-14",
      time: "20:00",
      location: "Jardín Botánico",
      backgroundColor: "#f0e6d2",
      textColor: "#8b1538",
      font: "serif",
    },
  },
]

interface TemplateSelectorProps {
  onTemplateSelect: (template: InvitationTemplate) => void
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTemplateSelect = (template: InvitationTemplate) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template)
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Plantillas</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-3">
              <div className="aspect-[3/2] mb-3 rounded-md overflow-hidden bg-muted">
                <Image
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-foreground">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Plantilla
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.content.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full bg-transparent">
        <Palette className="h-4 w-4 mr-2" />
        Crear Plantilla Personalizada
      </Button>
    </div>
  )
}

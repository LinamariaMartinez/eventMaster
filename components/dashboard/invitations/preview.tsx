"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Smartphone, Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import type { InvitationData } from "@/app/(dashboard)/invitations/page"

interface PreviewProps {
  invitationData: InvitationData
  viewMode: "desktop" | "mobile"
  onViewModeChange: (mode: "desktop" | "mobile") => void
}

export function Preview({ invitationData, viewMode, onViewModeChange }: PreviewProps) {
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

  const processContent = (content: string) => {
    return content
      .replace(/{nombre_invitado}/g, "María García")
      .replace(/{url_evento}/g, "https://evento.com/abc123")
      .replace(/{fecha}/g, invitationData.content.date)
      .replace(/{hora}/g, invitationData.content.time)
      .replace(/{lugar}/g, invitationData.content.location)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Vista Previa</h3>
          <p className="text-sm text-muted-foreground">Cómo se verá tu invitación</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {viewMode === "desktop" ? "Vista Escritorio" : "Vista Móvil"}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {viewMode === "desktop" ? "400x600px" : "320x480px"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div
              className={`relative rounded-lg border-2 border-border overflow-hidden shadow-lg ${
                viewMode === "desktop" ? "w-80 h-[480px]" : "w-64 h-96"
              }`}
              style={getBackgroundStyle()}
            >
              {/* Background Images */}
              {invitationData.images.map((image) => (
                <div
                  key={image.id}
                  className="absolute"
                  style={{
                    left: `${(image.x / 400) * 100}%`,
                    top: `${(image.y / 600) * 100}%`,
                    width: `${(image.width / 400) * 100}%`,
                    height: `${(image.height / 600) * 100}%`,
                  }}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt="Invitation element"
                    className="w-full h-full object-cover rounded"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  className={`font-bold mb-4 ${
                    viewMode === "desktop"
                      ? `text-${invitationData.styles.fontSize === "base" ? "xl" : invitationData.styles.fontSize}`
                      : "text-lg"
                  }`}
                >
                  {processContent(invitationData.content.title)}
                </h1>

                <p className={`mb-4 leading-relaxed ${viewMode === "desktop" ? "text-sm" : "text-xs"}`}>
                  {processContent(invitationData.content.description)}
                </p>

                <div className={`space-y-2 ${viewMode === "desktop" ? "text-sm" : "text-xs"}`}>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{invitationData.content.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{invitationData.content.time}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{invitationData.content.location}</span>
                  </p>
                </div>

                {/* Sample personalized content */}
                <div
                  className={`mt-4 pt-4 border-t border-current/20 ${
                    viewMode === "desktop" ? "text-xs" : "text-[10px]"
                  }`}
                >
                  <p className="opacity-75">Estimada María García, te esperamos en este evento especial.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">Los campos dinámicos se muestran con datos de ejemplo</p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Info */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plantilla:</span>
              <span>{invitationData.template?.name || "Personalizada"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fondo:</span>
              <span className="capitalize">{invitationData.styles.backgroundType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fuente:</span>
              <span>{invitationData.styles.font.split(",")[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Imágenes:</span>
              <span>{invitationData.images.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

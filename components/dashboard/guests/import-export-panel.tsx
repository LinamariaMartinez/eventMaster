"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import type { Guest } from "@/app/(dashboard)/guests/page"

interface ImportExportPanelProps {
  guests: Guest[]
  onImport: (guests: Guest[]) => void
}

export function ImportExportPanel({ guests, onImport }: ImportExportPanelProps) {
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportCSV = () => {
    const headers = [
      "Nombre",
      "Email",
      "Teléfono",
      "Estado",
      "Evento",
      "Fecha Invitación",
      "Fecha Respuesta",
      "Notas",
      "Etiquetas",
      "Empresa",
      "Cargo",
    ]

    const csvData = guests.map((guest) => [
      guest.name,
      guest.email,
      guest.phone || "",
      guest.status,
      guest.eventName || "",
      new Date(guest.invitedAt).toLocaleDateString("es-ES"),
      guest.respondedAt ? new Date(guest.respondedAt).toLocaleDateString("es-ES") : "",
      guest.notes || "",
      guest.tags.join("; "),
      guest.customFields.empresa || "",
      guest.customFields.cargo || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `invitados_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportGoogleSheets = () => {
    // Mock Google Sheets integration
    setImportStatus("processing")
    setImportMessage("Conectando con Google Sheets...")

    setTimeout(() => {
      setImportStatus("success")
      setImportMessage("Datos exportados exitosamente a Google Sheets")
      setTimeout(() => setImportStatus("idle"), 3000)
    }, 2000)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportStatus("processing")
    setImportMessage("Procesando archivo...")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n")
        lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

        const importedGuests: Guest[] = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = line.split(",").map((v) => v.replace(/"/g, "").trim())

            return {
              id: `imported_${Date.now()}_${index}`,
              name: values[0] || "",
              email: values[1] || "",
              phone: values[2] || undefined,
              status: (values[3] as Guest["status"]) || "pending",
              eventName: values[4] || undefined,
              invitedAt: new Date().toISOString(),
              notes: values[7] || undefined,
              tags: values[8] ? values[8].split(";").map((t) => t.trim()) : [],
              customFields: {
                empresa: values[9] || "",
                cargo: values[10] || "",
              },
            }
          })

        onImport(importedGuests)
        setImportStatus("success")
        setImportMessage(`${importedGuests.length} invitados importados exitosamente`)
        setTimeout(() => setImportStatus("idle"), 3000)
      } catch {
        setImportStatus("error")
        setImportMessage("Error al procesar el archivo. Verifica el formato.")
        setTimeout(() => setImportStatus("idle"), 3000)
      }
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Importar/Exportar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Exportar Datos</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent"
              onClick={handleExportGoogleSheets}
              disabled={importStatus === "processing"}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar a Google Sheets
            </Button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Importar Datos</h4>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => fileInputRef.current?.click()}
            disabled={importStatus === "processing"}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileImport} className="hidden" />
        </div>

        {/* Status Messages */}
        {importStatus !== "idle" && (
          <Alert className={importStatus === "error" ? "border-destructive" : ""}>
            <div className="flex items-center gap-2">
              {importStatus === "processing" && (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
              {importStatus === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
              {importStatus === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
            </div>
            <AlertDescription className="mt-2">{importMessage}</AlertDescription>
          </Alert>
        )}

        {/* Integration Status */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Google Sheets</span>
            <Badge variant="outline" className="text-xs">
              Conectado
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

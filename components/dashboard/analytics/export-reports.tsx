"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, FileSpreadsheet, Mail, ChevronDown } from "lucide-react"

export function ExportReports() {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState("pdf")
  const [timeRange, setTimeRange] = useState("6m")

  const reportTypes = [
    { id: "overview", label: "Resumen General", description: "Estadísticas principales y métricas clave" },
    { id: "events", label: "Rendimiento de Eventos", description: "Análisis detallado por evento" },
    { id: "guests", label: "Análisis de Invitados", description: "Segmentación y comportamiento de invitados" },
    { id: "trends", label: "Tendencias Temporales", description: "Evolución de métricas en el tiempo" },
    { id: "predictions", label: "Predicciones", description: "Proyecciones y recomendaciones" },
  ]

  const handleReportToggle = (reportId: string) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  const handleExport = () => {
    setShowExportDialog(false)
    setSelectedReports([])
  }

  const handleQuickExport = (_format: string) => {
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleQuickExport("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            Reporte PDF Completo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickExport("excel")}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Datos en Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Reporte Personalizado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exportar Reporte Personalizado</DialogTitle>
            <DialogDescription>Selecciona las secciones que deseas incluir en tu reporte.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Report Sections */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Secciones del Reporte</Label>
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={report.id}
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => handleReportToggle(report.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={report.id} className="text-sm font-medium cursor-pointer">
                      {report.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Formato de Exportación</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Período de Tiempo</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Último mes</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="1y">Último año</SelectItem>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={selectedReports.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

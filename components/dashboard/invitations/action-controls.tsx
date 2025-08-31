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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Download, FileImage, FileText, Mail, Send, Users, ChevronDown } from "lucide-react"
import type { InvitationData } from "@/app/(dashboard)/editor/page"

interface ActionControlsProps {
  invitationData: InvitationData
  onSave: () => void
  onExportPDF: () => void
  onExportImage: () => void
  onSendEmail: () => void
}

// Mock guest data
const mockGuests = [
  { id: "1", name: "María García", email: "maria@email.com", status: "pending" },
  { id: "2", name: "Juan Pérez", email: "juan@email.com", status: "confirmed" },
  { id: "3", name: "Ana López", email: "ana@email.com", status: "pending" },
  { id: "4", name: "Carlos Ruiz", email: "carlos@email.com", status: "declined" },
  { id: "5", name: "Laura Martín", email: "laura@email.com", status: "pending" },
]

export function ActionControls({
  onSave,
  onExportPDF,
  onExportImage,
  onSendEmail,
}: ActionControlsProps) {
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const handleGuestToggle = (guestId: string) => {
    setSelectedGuests((prev) => (prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]))
  }

  const handleSendEmails = () => {
    onSendEmail()
    setShowEmailDialog(false)
    setSelectedGuests([])
  }

  return (
    <div className="flex items-center gap-2">
      {/* Save Button */}
      <Button onClick={onSave} className="gap-2">
        <Save className="h-4 w-4" />
        Guardar
      </Button>

      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar como PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportImage}>
            <FileImage className="h-4 w-4 mr-2" />
            Exportar como Imagen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Mail className="h-4 w-4" />
            Enviar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enviar Invitaciones
            </DialogTitle>
            <DialogDescription>Selecciona los invitados que recibirán esta invitación personalizada.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Invitados ({mockGuests.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allIds = mockGuests.map((g) => g.id)
                  setSelectedGuests(selectedGuests.length === allIds.length ? [] : allIds)
                }}
              >
                {selectedGuests.length === mockGuests.length ? "Deseleccionar" : "Seleccionar"} Todo
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockGuests.map((guest) => (
                <div key={guest.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                  <Checkbox
                    id={guest.id}
                    checked={selectedGuests.includes(guest.id)}
                    onCheckedChange={() => handleGuestToggle(guest.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{guest.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
                  </div>
                  <Badge
                    variant={
                      guest.status === "confirmed"
                        ? "default"
                        : guest.status === "declined"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {guest.status === "confirmed"
                      ? "Confirmado"
                      : guest.status === "declined"
                        ? "Rechazado"
                        : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </div>

            {selectedGuests.length > 0 && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>{selectedGuests.length}</strong> invitado{selectedGuests.length !== 1 ? "s" : ""} seleccionado
                  {selectedGuests.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cada invitación será personalizada con el nombre del invitado
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmails} disabled={selectedGuests.length === 0} className="gap-2">
              <Send className="h-4 w-4" />
              Enviar {selectedGuests.length > 0 && `(${selectedGuests.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

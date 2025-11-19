"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Mail, Phone, ArrowUpDown, MessageSquare, Send, Check } from "lucide-react"
import type { Guest } from "@/app/(dashboard)/guests/page"
import { toast } from "sonner"

interface GuestListProps {
  guests: Guest[]
  selectedGuests: string[]
  onSelectionChange: (selected: string[]) => void
  onEdit: (guest: Guest) => void
  onDelete: (guestId: string) => void
  onSendWhatsApp?: (guest: Guest) => void
  eventData?: {
    title: string
    date: string
    time: string
    location: string
    hostName: string
    invitationUrl: string
  }
  whatsappTemplate?: string
}

type SortField = "name" | "email" | "status" | "invitedAt" | "eventName"
type SortDirection = "asc" | "desc"

export function GuestList({
  guests,
  selectedGuests,
  onSelectionChange,
  onEdit,
  onDelete,
  onSendWhatsApp,
  eventData,
  whatsappTemplate = `¡Hola {nombre}! 👋

Te invitamos a nuestro evento:

🎉 *{evento}*
📅 Fecha: {fecha}
🕒 Hora: {hora}
📍 Lugar: {ubicacion}

Para ver todos los detalles y confirmar tu asistencia, visita:
{url}

¡Esperamos verte allí!

Saludos,
{anfitrion}`
}: GuestListProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Function to encode message for WhatsApp while preserving emojis
  const encodeWhatsAppMessage = (message: string): string => {
    // WhatsApp accepts emojis and most Unicode characters directly
    // We only need to encode special URL characters
    return message
      .replace(/%/g, '%25')  // Encode % first
      .replace(/&/g, '%26')
      .replace(/=/g, '%3D')
      .replace(/\?/g, '%3F')
      .replace(/#/g, '%23')
      .replace(/\n/g, '%0A')  // Newlines
      .replace(/\r/g, '')      // Remove carriage returns
      .replace(/\+/g, '%2B');
  };

  const generateWhatsAppUrl = (guest: Guest) => {
    if (!eventData || !guest.phone) return null

    const message = whatsappTemplate
      .replace(/{nombre}/g, guest.name)
      .replace(/{evento}/g, eventData.title)
      .replace(/{fecha}/g, eventData.date)
      .replace(/{hora}/g, eventData.time)
      .replace(/{ubicacion}/g, eventData.location)
      .replace(/{anfitrion}/g, eventData.hostName)
      .replace(/{url}/g, eventData.invitationUrl)

    const cleanPhone = guest.phone.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeWhatsAppMessage(message)}`
  }

  const handleSendWhatsApp = (guest: Guest) => {
    const whatsappUrl = generateWhatsAppUrl(guest)

    if (!whatsappUrl) {
      toast.error('El invitado no tiene número de teléfono')
      return
    }

    window.open(whatsappUrl, '_blank')

    if (onSendWhatsApp) {
      onSendWhatsApp(guest)
    }

    toast.success(`Invitación enviada a ${guest.name}`)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedGuests = [...guests].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "email":
        aValue = (a.email || "").toLowerCase()
        bValue = (b.email || "").toLowerCase()
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "invitedAt":
        aValue = new Date(a.createdAt || a.created_at || new Date()).getTime()
        bValue = new Date(b.createdAt || b.created_at || new Date()).getTime()
        break
      case "eventName":
        aValue = (a.eventName || "").toLowerCase()
        bValue = (b.eventName || "").toLowerCase()
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(guests.map((g) => g.id))
    }
  }

  const handleSelectGuest = (guestId: string) => {
    if (selectedGuests.includes(guestId)) {
      onSelectionChange(selectedGuests.filter((id) => id !== guestId))
    } else {
      onSelectionChange([...selectedGuests, guestId])
    }
  }

  const getStatusBadge = (status: Guest["status"]) => {
    const variants = {
      confirmed: "default",
      pending: "outline",
      declined: "destructive",
      maybe: "secondary",
    } as const

    const labels = {
      confirmed: "Confirmado",
      pending: "Pendiente",
      declined: "Rechazado",
      maybe: "Tal vez",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="overflow-auto h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedGuests.length === guests.length && guests.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>
              <SortButton field="name">Nombre</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="email">Email</SortButton>
            </TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>
              <SortButton field="status">Estado</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="eventName">Evento</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="invitedAt">Invitado</SortButton>
            </TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGuests.map((guest) => (
            <TableRow key={guest.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedGuests.includes(guest.id)}
                  onCheckedChange={() => handleSelectGuest(guest.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{guest.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {guest.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{guest.phone}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(guest.status)}</TableCell>
              <TableCell>
                <span className="text-sm">{guest.eventName || "Sin evento"}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{formatDate(guest.createdAt || guest.created_at || new Date().toISOString())}</span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {guest.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(guest.tags?.length || 0) > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(guest.tags?.length || 0) - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* WhatsApp Button */}
                  {guest.phone && eventData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(guest)}
                      className="gap-1"
                      title="Enviar por WhatsApp"
                    >
                      {guest.whatsapp_sent ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {/* More Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {guest.phone && eventData && (
                        <DropdownMenuItem onClick={() => handleSendWhatsApp(guest)}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar por WhatsApp
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(guest)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(guest.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sortedGuests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron invitados</p>
        </div>
      )}
    </div>
  )
}

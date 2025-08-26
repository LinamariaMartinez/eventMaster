'use client'

import { useState } from "react"
import Link from "next/link"
import { Event } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, getEventStatus } from "@/lib/utils"
import { 
  Calendar,
  MapPin,
  Users,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2
} from "lucide-react"

interface EventListProps {
  events: Event[]
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
  onCopyLink?: (event: Event) => void
}

export function EventList({ 
  events, 
  onEdit, 
  onDelete, 
  onCopyLink 
}: EventListProps) {
  const [showActions, setShowActions] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'past':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Próximo'
      case 'ongoing':
        return 'En curso'
      case 'past':
        return 'Finalizado'
      default:
        return 'Desconocido'
    }
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay eventos
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Comienza creando tu primer evento
          </p>
          <Button asChild>
            <Link href="/dashboard/events/new">
              Crear Evento
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const status = getEventStatus(event.date)
        
        return (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2">
                    <Link 
                      href={`/dashboard/events/${event.id}`}
                      className="hover:text-[#8B4B6B] transition-colors"
                    >
                      {event.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.date)} • {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(status)}>
                    {getStatusLabel(status)}
                  </Badge>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowActions(
                        showActions === event.id ? null : event.id
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {showActions === event.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border py-1 z-10 min-w-[120px]">
                        <button
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            onEdit?.(event)
                            setShowActions(null)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </button>
                        <button
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            onCopyLink?.(event)
                            setShowActions(null)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar link
                        </button>
                        <button
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center text-red-600"
                          onClick={() => {
                            onDelete?.(event.id)
                            setShowActions(null)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {event.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {event.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/dashboard/events/${event.id}/invitations`}
                    className="text-sm text-[#8B4B6B] hover:underline flex items-center"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Gestionar invitados
                  </Link>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={event.public_url} target="_blank">
                      Ver invitación
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/events/${event.id}`}>
                      Ver detalles
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
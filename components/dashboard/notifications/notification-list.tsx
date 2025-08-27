"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Bell,
  Calendar,
  Users,
  Mail,
  AlertTriangle,
  Settings,
  MoreHorizontal,
  Eye,
  Trash2,
  ExternalLink,
  Clock,
} from "lucide-react"
import type { Notification } from "@/app/(dashboard)/notifications/page"

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

const typeIcons = {
  event_reminder: Calendar,
  rsvp_update: Users,
  guest_added: Users,
  invitation_sent: Mail,
  system: Settings,
  deadline: AlertTriangle,
}

const typeLabels = {
  event_reminder: "Recordatorio",
  rsvp_update: "RSVP",
  guest_added: "Invitado",
  invitation_sent: "Invitación",
  system: "Sistema",
  deadline: "Fecha límite",
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-gray-100 text-gray-800 border-gray-200",
}

export function NotificationList({ notifications, onMarkAsRead, onDelete }: NotificationListProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `hace ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `hace ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `hace ${diffInDays}d`
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No hay notificaciones</h3>
        <p className="text-muted-foreground">
          No se encontraron notificaciones que coincidan con los filtros aplicados.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full p-6 space-y-3">
      {notifications.map((notification) => {
        const IconComponent = typeIcons[notification.type]
        return (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
            } ${notification.actionRequired ? "ring-1 ring-orange-200" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`p-2 rounded-md flex-shrink-0 ${
                    notification.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : notification.priority === "medium"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Marcar como leída
                          </DropdownMenuItem>
                        )}
                        {notification.actionUrl && (
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(notification.timestamp)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[notification.type]}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${priorityColors[notification.priority]}`}>
                      {notification.priority === "high"
                        ? "Alta"
                        : notification.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </Badge>
                    {notification.eventName && <span className="text-xs">📅 {notification.eventName}</span>}
                    {notification.guestName && <span className="text-xs">👤 {notification.guestName}</span>}
                  </div>

                  {/* Action Required */}
                  {notification.actionRequired && (
                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Acción requerida</span>
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                            Ver detalles
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

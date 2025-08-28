"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { NotificationList } from "@/components/dashboard/notifications/notification-list";
import { NotificationSettings } from "@/components/dashboard/notifications/notification-settings";
import { NotificationTemplates } from "@/components/dashboard/notifications/notification-templates";
import { AutomatedReminders } from "@/components/dashboard/notifications/automated-reminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Search,
  Settings,
  Clock,
  BookTemplate as Template,
} from "lucide-react";

export interface Notification {
  id: string;
  type:
    | "event_reminder"
    | "rsvp_update"
    | "guest_added"
    | "invitation_sent"
    | "system"
    | "deadline";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  eventId?: string;
  eventName?: string;
  guestName?: string;
  actionRequired?: boolean;
  actionUrl?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "event_reminder",
    title: "Recordatorio: Cena de Gala 2025",
    message: "El evento comienza en 2 días. Revisa la lista de confirmados.",
    timestamp: "2025-01-20T10:00:00Z",
    read: false,
    priority: "high",
    eventId: "evt1",
    eventName: "Cena de Gala 2025",
    actionRequired: true,
    actionUrl: "/events/evt1",
  },
  {
    id: "2",
    type: "rsvp_update",
    title: "Nueva confirmación recibida",
    message: "María García ha confirmado su asistencia a Conferencia Tech",
    timestamp: "2025-01-20T09:30:00Z",
    read: false,
    priority: "medium",
    eventId: "evt2",
    eventName: "Conferencia Tech",
    guestName: "María García",
  },
  {
    id: "3",
    type: "invitation_sent",
    title: "Invitaciones enviadas exitosamente",
    message: "Se enviaron 150 invitaciones para Networking Empresarial",
    timestamp: "2025-01-20T08:15:00Z",
    read: true,
    priority: "low",
    eventId: "evt3",
    eventName: "Networking Empresarial",
  },
  {
    id: "4",
    type: "deadline",
    title: "Fecha límite de confirmación",
    message: "La fecha límite para Workshop Innovación vence mañana",
    timestamp: "2025-01-19T16:45:00Z",
    read: false,
    priority: "high",
    eventId: "evt4",
    eventName: "Workshop Innovación",
    actionRequired: true,
  },
  {
    id: "5",
    type: "guest_added",
    title: "Nuevos invitados agregados",
    message: "Se agregaron 25 nuevos invitados a Lanzamiento Producto",
    timestamp: "2025-01-19T14:20:00Z",
    read: true,
    priority: "low",
    eventId: "evt5",
    eventName: "Lanzamiento Producto",
  },
  {
    id: "6",
    type: "system",
    title: "Actualización del sistema",
    message: "Nueva funcionalidad de plantillas de invitación disponible",
    timestamp: "2025-01-19T12:00:00Z",
    read: true,
    priority: "low",
  },
];

export default function NotificacionesPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.eventName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      notification.guestName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && notification.read) ||
      (readFilter === "unread" && !notification.read);

    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter(
    (n) => n.priority === "high" && !n.read,
  ).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Centro de Notificaciones
              </h1>
              <p className="text-muted-foreground">
                Mantente al día con tus eventos e invitados
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <Bell className="h-3 w-3" />
                  {unreadCount} sin leer
                </Badge>
              )}
              {highPriorityCount > 0 && (
                <Badge
                  variant="default"
                  className="bg-orange-100 text-orange-800 gap-1"
                >
                  ⚠️ {highPriorityCount} urgentes
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="bg-transparent"
              >
                Marcar todo como leído
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Filters */}
          <div className="w-80 border-r border-border p-4 space-y-6 overflow-y-auto">
            {/* Search */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Buscar Notificaciones
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, evento o invitado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Filtrar por Tipo</h3>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="event_reminder">
                      Recordatorios de evento
                    </SelectItem>
                    <SelectItem value="rsvp_update">
                      Actualizaciones RSVP
                    </SelectItem>
                    <SelectItem value="invitation_sent">
                      Invitaciones enviadas
                    </SelectItem>
                    <SelectItem value="guest_added">
                      Invitados agregados
                    </SelectItem>
                    <SelectItem value="deadline">Fechas límite</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">
                  Filtrar por Prioridad
                </h3>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las prioridades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Estado de Lectura</h3>
                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Sin leer</SelectItem>
                    <SelectItem value="read">Leídas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-sm font-medium">Resumen</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span>{notifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sin leer:</span>
                  <span className="font-medium">{unreadCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alta prioridad:</span>
                  <span className="font-medium text-orange-600">
                    {highPriorityCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Requieren acción:
                  </span>
                  <span className="font-medium text-red-600">
                    {
                      notifications.filter((n) => n.actionRequired && !n.read)
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="notifications" className="h-full flex flex-col">
              <div className="border-b border-border px-6 py-2">
                <TabsList>
                  <TabsTrigger value="notifications" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones ({filteredNotifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="gap-2">
                    <Template className="h-4 w-4" />
                    Plantillas
                  </TabsTrigger>
                  <TabsTrigger value="reminders" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Recordatorios
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="notifications"
                className="flex-1 overflow-hidden m-0"
              >
                <NotificationList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>

              <TabsContent
                value="settings"
                className="flex-1 overflow-y-auto m-0 p-6"
              >
                <NotificationSettings />
              </TabsContent>

              <TabsContent
                value="templates"
                className="flex-1 overflow-y-auto m-0 p-6"
              >
                <NotificationTemplates />
              </TabsContent>

              <TabsContent
                value="reminders"
                className="flex-1 overflow-y-auto m-0 p-6"
              >
                <AutomatedReminders />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Edit, Trash2, MoreHorizontal, Clock, Calendar, Users, Mail, Bell } from "lucide-react"

interface AutomatedReminder {
  id: string
  name: string
  enabled: boolean
  trigger: "days_before" | "hours_before" | "rsvp_deadline" | "no_response"
  timing: number // days or hours
  eventTypes: string[]
  notificationType: "email" | "push" | "sms" | "all"
  templateId: string
  conditions: {
    minGuests?: number
    maxGuests?: number
    onlyUnconfirmed?: boolean
    excludeDeclined?: boolean
  }
  lastRun?: string
  nextRun?: string
  totalSent: number
}

const mockReminders: AutomatedReminder[] = [
  {
    id: "1",
    name: "Recordatorio 24h antes del evento",
    enabled: true,
    trigger: "hours_before",
    timing: 24,
    eventTypes: ["all"],
    notificationType: "email",
    templateId: "template_1",
    conditions: {
      onlyUnconfirmed: false,
      excludeDeclined: true,
    },
    lastRun: "2024-01-20T10:00:00Z",
    nextRun: "2024-01-21T10:00:00Z",
    totalSent: 156,
  },
  {
    id: "2",
    name: "Recordatorio push 2h antes",
    enabled: true,
    trigger: "hours_before",
    timing: 2,
    eventTypes: ["all"],
    notificationType: "push",
    templateId: "template_3",
    conditions: {
      onlyUnconfirmed: false,
      excludeDeclined: true,
    },
    lastRun: "2024-01-20T16:00:00Z",
    nextRun: "2024-01-21T16:00:00Z",
    totalSent: 89,
  },
  {
    id: "3",
    name: "Seguimiento sin respuesta - 3 días",
    enabled: true,
    trigger: "no_response",
    timing: 3,
    eventTypes: ["corporate", "networking"],
    notificationType: "email",
    templateId: "template_2",
    conditions: {
      onlyUnconfirmed: true,
      minGuests: 10,
    },
    lastRun: "2024-01-19T09:00:00Z",
    nextRun: "2024-01-22T09:00:00Z",
    totalSent: 45,
  },
  {
    id: "4",
    name: "Fecha límite RSVP - 1 día antes",
    enabled: false,
    trigger: "rsvp_deadline",
    timing: 1,
    eventTypes: ["all"],
    notificationType: "all",
    templateId: "template_4",
    conditions: {
      onlyUnconfirmed: true,
    },
    totalSent: 0,
  },
]

export function AutomatedReminders() {
  const [reminders, setReminders] = useState<AutomatedReminder[]>(mockReminders)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingReminder, setEditingReminder] = useState<AutomatedReminder | null>(null)

  const handleToggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === reminderId ? { ...reminder, enabled: !reminder.enabled } : reminder)),
    )
  }

  const handleCreateReminder = (reminderData: Omit<AutomatedReminder, "id" | "totalSent">) => {
    const newReminder: AutomatedReminder = {
      ...reminderData,
      id: Date.now().toString(),
      totalSent: 0,
    }
    setReminders([...reminders, newReminder])
    setShowCreateDialog(false)
  }

  const handleEditReminder = (reminderData: Omit<AutomatedReminder, "id" | "totalSent">) => {
    if (!editingReminder) return

    const updatedReminder: AutomatedReminder = {
      ...reminderData,
      id: editingReminder.id,
      totalSent: editingReminder.totalSent,
    }

    setReminders(reminders.map((r) => (r.id === editingReminder.id ? updatedReminder : r)))
    setEditingReminder(null)
  }

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(reminders.filter((r) => r.id !== reminderId))
  }

  const getTriggerLabel = (trigger: AutomatedReminder["trigger"], timing: number) => {
    switch (trigger) {
      case "days_before":
        return `${timing} día${timing !== 1 ? "s" : ""} antes del evento`
      case "hours_before":
        return `${timing} hora${timing !== 1 ? "s" : ""} antes del evento`
      case "rsvp_deadline":
        return `${timing} día${timing !== 1 ? "s" : ""} antes de la fecha límite RSVP`
      case "no_response":
        return `${timing} día${timing !== 1 ? "s" : ""} sin respuesta`
    }
  }

  const getNotificationTypeIcon = (type: AutomatedReminder["notificationType"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      case "sms":
        return <Users className="h-4 w-4" />
      case "all":
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Recordatorios Automáticos</h2>
          <p className="text-muted-foreground">
            Configura recordatorios automáticos para mantener a tus invitados informados.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Recordatorio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Recordatorio Automático</DialogTitle>
            </DialogHeader>
            <ReminderForm onSubmit={handleCreateReminder} onCancel={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Reminders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{reminders.filter((r) => r.enabled).length}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{reminders.reduce((sum, r) => sum + r.totalSent, 0)}</p>
                <p className="text-sm text-muted-foreground">Enviados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reminders.filter((r) => r.nextRun).length}</p>
                <p className="text-sm text-muted-foreground">Programados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(reminders.reduce((sum, r) => sum + r.totalSent, 0) / Math.max(reminders.length, 1))}
                </p>
                <p className="text-sm text-muted-foreground">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Switch checked={reminder.enabled} onCheckedChange={() => handleToggleReminder(reminder.id)} />
                  <div className="flex items-center gap-2">
                    {getNotificationTypeIcon(reminder.notificationType)}
                    <div>
                      <h3 className="font-medium">{reminder.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getTriggerLabel(reminder.trigger, reminder.timing)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant={reminder.enabled ? "default" : "secondary"}>
                        {reminder.enabled ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {reminder.totalSent} enviados
                      </Badge>
                    </div>
                    {reminder.nextRun && (
                      <p className="text-xs text-muted-foreground mt-1">Próximo: {formatDate(reminder.nextRun)}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingReminder(reminder)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteReminder(reminder.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Conditions */}
              {Object.keys(reminder.conditions).length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Label className="text-xs font-medium text-muted-foreground">Condiciones</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {reminder.conditions.onlyUnconfirmed && (
                      <Badge variant="outline" className="text-xs">
                        Solo sin confirmar
                      </Badge>
                    )}
                    {reminder.conditions.excludeDeclined && (
                      <Badge variant="outline" className="text-xs">
                        Excluir rechazados
                      </Badge>
                    )}
                    {reminder.conditions.minGuests && (
                      <Badge variant="outline" className="text-xs">
                        Min. {reminder.conditions.minGuests} invitados
                      </Badge>
                    )}
                    {reminder.conditions.maxGuests && (
                      <Badge variant="outline" className="text-xs">
                        Max. {reminder.conditions.maxGuests} invitados
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReminder} onOpenChange={() => setEditingReminder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Recordatorio</DialogTitle>
          </DialogHeader>
          {editingReminder && (
            <ReminderForm
              initialData={editingReminder}
              onSubmit={handleEditReminder}
              onCancel={() => setEditingReminder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ReminderFormProps {
  initialData?: AutomatedReminder
  onSubmit: (data: Omit<AutomatedReminder, "id" | "totalSent">) => void
  onCancel: () => void
}

function ReminderForm({ initialData, onSubmit, onCancel }: ReminderFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    enabled: initialData?.enabled ?? true,
    trigger: initialData?.trigger || ("days_before" as AutomatedReminder["trigger"]),
    timing: initialData?.timing || 1,
    eventTypes: initialData?.eventTypes || ["all"],
    notificationType: initialData?.notificationType || ("email" as AutomatedReminder["notificationType"]),
    templateId: initialData?.templateId || "",
    conditions: initialData?.conditions || {},
    lastRun: initialData?.lastRun,
    nextRun: initialData?.nextRun,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del recordatorio</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trigger">Disparador</Label>
          <Select
            value={formData.trigger}
            onValueChange={(value: AutomatedReminder["trigger"]) =>
              setFormData((prev) => ({ ...prev, trigger: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days_before">Días antes del evento</SelectItem>
              <SelectItem value="hours_before">Horas antes del evento</SelectItem>
              <SelectItem value="rsvp_deadline">Antes de fecha límite RSVP</SelectItem>
              <SelectItem value="no_response">Sin respuesta por X días</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timing">{formData.trigger.includes("hours") ? "Horas" : "Días"}</Label>
          <Input
            id="timing"
            type="number"
            min="1"
            value={formData.timing}
            onChange={(e) => setFormData((prev) => ({ ...prev, timing: Number.parseInt(e.target.value) || 1 }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notificationType">Tipo de notificación</Label>
        <Select
          value={formData.notificationType}
          onValueChange={(value: AutomatedReminder["notificationType"]) =>
            setFormData((prev) => ({ ...prev, notificationType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Solo Email</SelectItem>
            <SelectItem value="push">Solo Push</SelectItem>
            <SelectItem value="sms">Solo SMS</SelectItem>
            <SelectItem value="all">Todos los tipos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="templateId">Plantilla</Label>
        <Select
          value={formData.templateId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, templateId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar plantilla" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template_1">Recordatorio 24h - Email</SelectItem>
            <SelectItem value="template_2">Confirmación RSVP - Email</SelectItem>
            <SelectItem value="template_3">Recordatorio 2h - Push</SelectItem>
            <SelectItem value="template_4">SMS Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Condiciones adicionales</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="onlyUnconfirmed"
              checked={formData.conditions.onlyUnconfirmed || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  conditions: { ...prev.conditions, onlyUnconfirmed: checked },
                }))
              }
            />
            <Label htmlFor="onlyUnconfirmed">Solo enviar a invitados sin confirmar</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="excludeDeclined"
              checked={formData.conditions.excludeDeclined || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  conditions: { ...prev.conditions, excludeDeclined: checked },
                }))
              }
            />
            <Label htmlFor="excludeDeclined">Excluir invitados que rechazaron</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Crear"} Recordatorio</Button>
      </div>
    </form>
  )
}

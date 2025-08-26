"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, Smartphone, Clock, Calendar, Users, AlertTriangle } from "lucide-react"

interface NotificationPreferences {
  email: {
    enabled: boolean
    eventReminders: boolean
    rsvpUpdates: boolean
    guestUpdates: boolean
    deadlines: boolean
    systemUpdates: boolean
  }
  push: {
    enabled: boolean
    eventReminders: boolean
    rsvpUpdates: boolean
    guestUpdates: boolean
    deadlines: boolean
  }
  sms: {
    enabled: boolean
    urgentOnly: boolean
    phone: string
  }
  timing: {
    quietHours: boolean
    quietStart: string
    quietEnd: string
    timezone: string
  }
  frequency: {
    digest: "none" | "daily" | "weekly"
    digestTime: string
  }
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: true,
      eventReminders: true,
      rsvpUpdates: true,
      guestUpdates: false,
      deadlines: true,
      systemUpdates: false,
    },
    push: {
      enabled: true,
      eventReminders: true,
      rsvpUpdates: true,
      guestUpdates: true,
      deadlines: true,
    },
    sms: {
      enabled: false,
      urgentOnly: true,
      phone: "",
    },
    timing: {
      quietHours: true,
      quietStart: "22:00",
      quietEnd: "08:00",
      timezone: "Europe/Madrid",
    },
    frequency: {
      digest: "daily",
      digestTime: "09:00",
    },
  })

  const handleEmailToggle = (key: keyof typeof preferences.email) => {
    setPreferences((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key],
      },
    }))
  }

  const handlePushToggle = (key: keyof typeof preferences.push) => {
    setPreferences((prev) => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: !prev.push[key],
      },
    }))
  }

  const handleSmsToggle = (key: keyof typeof preferences.sms) => {
    if (key === "phone") return
    setPreferences((prev) => ({
      ...prev,
      sms: {
        ...prev.sms,
        [key]: !prev.sms[key as keyof Omit<typeof preferences.sms, "phone">],
      },
    }))
  }

  const handleTimingChange = (key: keyof typeof preferences.timing, value: string | boolean) => {
    setPreferences((prev) => ({
      ...prev,
      timing: {
        ...prev.timing,
        [key]: value,
      },
    }))
  }

  const handleFrequencyChange = (key: keyof typeof preferences.frequency, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    // Here you would save to backend
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Configuración de Notificaciones</h2>
        <p className="text-muted-foreground">Personaliza cómo y cuándo recibes notificaciones sobre tus eventos.</p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificaciones por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Habilitar notificaciones por email</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones en tu correo electrónico</p>
            </div>
            <Switch checked={preferences.email.enabled} onCheckedChange={() => handleEmailToggle("enabled")} />
          </div>

          {preferences.email.enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label>Recordatorios de eventos</Label>
                  </div>
                  <Switch
                    checked={preferences.email.eventReminders}
                    onCheckedChange={() => handleEmailToggle("eventReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label>Actualizaciones de RSVP</Label>
                  </div>
                  <Switch
                    checked={preferences.email.rsvpUpdates}
                    onCheckedChange={() => handleEmailToggle("rsvpUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Label>Cambios en invitados</Label>
                  </div>
                  <Switch
                    checked={preferences.email.guestUpdates}
                    onCheckedChange={() => handleEmailToggle("guestUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <Label>Fechas límite importantes</Label>
                  </div>
                  <Switch
                    checked={preferences.email.deadlines}
                    onCheckedChange={() => handleEmailToggle("deadlines")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label>Actualizaciones del sistema</Label>
                  </div>
                  <Switch
                    checked={preferences.email.systemUpdates}
                    onCheckedChange={() => handleEmailToggle("systemUpdates")}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones Push
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Habilitar notificaciones push</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones instantáneas en el navegador</p>
            </div>
            <Switch checked={preferences.push.enabled} onCheckedChange={() => handlePushToggle("enabled")} />
          </div>

          {preferences.push.enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Recordatorios de eventos</Label>
                  <Switch
                    checked={preferences.push.eventReminders}
                    onCheckedChange={() => handlePushToggle("eventReminders")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Actualizaciones de RSVP</Label>
                  <Switch
                    checked={preferences.push.rsvpUpdates}
                    onCheckedChange={() => handlePushToggle("rsvpUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Cambios en invitados</Label>
                  <Switch
                    checked={preferences.push.guestUpdates}
                    onCheckedChange={() => handlePushToggle("guestUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Fechas límite importantes</Label>
                  <Switch checked={preferences.push.deadlines} onCheckedChange={() => handlePushToggle("deadlines")} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Notificaciones SMS
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Habilitar notificaciones SMS</Label>
              <p className="text-sm text-muted-foreground">Recibe notificaciones importantes por mensaje de texto</p>
            </div>
            <Switch checked={preferences.sms.enabled} onCheckedChange={() => handleSmsToggle("enabled")} />
          </div>

          {preferences.sms.enabled && (
            <>
              <Separator />
              <div className="space-y-3">
                <div>
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+34 600 123 456"
                    value={preferences.sms.phone}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        sms: { ...prev.sms, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Solo notificaciones urgentes</Label>
                    <p className="text-sm text-muted-foreground">Recibe SMS solo para eventos críticos</p>
                  </div>
                  <Switch checked={preferences.sms.urgentOnly} onCheckedChange={() => handleSmsToggle("urgentOnly")} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horarios y Frecuencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Horario de silencio</Label>
              <p className="text-sm text-muted-foreground">No recibir notificaciones durante estas horas</p>
            </div>
            <Switch
              checked={preferences.timing.quietHours}
              onCheckedChange={(checked) => handleTimingChange("quietHours", checked)}
            />
          </div>

          {preferences.timing.quietHours && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quietStart">Inicio</Label>
                <Input
                  id="quietStart"
                  type="time"
                  value={preferences.timing.quietStart}
                  onChange={(e) => handleTimingChange("quietStart", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quietEnd">Fin</Label>
                <Input
                  id="quietEnd"
                  type="time"
                  value={preferences.timing.quietEnd}
                  onChange={(e) => handleTimingChange("quietEnd", e.target.value)}
                />
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div>
              <Label>Resumen diario/semanal</Label>
              <Select
                value={preferences.frequency.digest}
                onValueChange={(value) => handleFrequencyChange("digest", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Deshabilitado</SelectItem>
                  <SelectItem value="daily">Resumen diario</SelectItem>
                  <SelectItem value="weekly">Resumen semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {preferences.frequency.digest !== "none" && (
              <div>
                <Label htmlFor="digestTime">Hora del resumen</Label>
                <Input
                  id="digestTime"
                  type="time"
                  value={preferences.frequency.digestTime}
                  onChange={(e) => handleFrequencyChange("digestTime", e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}

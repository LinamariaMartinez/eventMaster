"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EventFormData, Template } from "@/types";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  description: z.string().optional(),
  template_id: z.string().optional(),
  whatsapp_number: z.string().optional(),
});

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  templates: Template[];
  onSubmit: (data: EventFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EventForm({
  initialData,
  templates,
  onSubmit,
  isLoading = false,
}: EventFormProps) {
  const [settings, setSettings] = useState({
    allowPlusOnes: initialData?.settings?.allowPlusOnes ?? true,
    requirePhone: initialData?.settings?.requirePhone ?? false,
    requireEmail: initialData?.settings?.requireEmail ?? true,
    maxGuestsPerInvite: initialData?.settings?.maxGuestsPerInvite ?? 2,
    rsvpDeadline: initialData?.settings?.rsvpDeadline ?? "",
    customFields: initialData?.settings?.customFields ?? [],
    colors: {
      primary: initialData?.settings?.colors?.primary ?? "#8B4B6B",
      secondary: initialData?.settings?.colors?.secondary ?? "#F5F1E8",
      accent: initialData?.settings?.colors?.accent ?? "#D4A574",
    },
  });

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      date: initialData?.date ?? "",
      time: initialData?.time ?? "",
      location: initialData?.location ?? "",
      description: initialData?.description ?? "",
      template_id: initialData?.template_id ?? "",
      whatsapp_number: initialData?.whatsapp_number ?? "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    try {
      await onSubmit({
        ...data,
        settings,
      });
      toast.success("Evento guardado exitosamente");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Error al guardar el evento");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título del Evento</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Ej: Boda de María y Carlos"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" {...form.register("date")} />
              {form.formState.errors.date && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" {...form.register("time")} />
              {form.formState.errors.time && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="Ej: Salón de Eventos Los Jardines"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe tu evento..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="whatsapp_number">Número WhatsApp para confirmaciones (Opcional)</Label>
            <Input
              id="whatsapp_number"
              type="tel"
              {...form.register("whatsapp_number")}
              placeholder="+57 300 123 4567"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Si lo proporcionas, los invitados podrán confirmar por WhatsApp a este número
            </p>
          </div>

          <div>
            <Label htmlFor="template">Plantilla</Label>
            <Select
              value={form.watch("template_id")}
              onValueChange={(value) => form.setValue("template_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Invitaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowPlusOnes"
              checked={settings.allowPlusOnes}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, allowPlusOnes: !!checked }))
              }
            />
            <Label htmlFor="allowPlusOnes">Permitir acompañantes</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requirePhone"
              checked={settings.requirePhone}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, requirePhone: !!checked }))
              }
            />
            <Label htmlFor="requirePhone">Requerir número de teléfono</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireEmail"
              checked={settings.requireEmail}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, requireEmail: !!checked }))
              }
            />
            <Label htmlFor="requireEmail">Requerir email</Label>
          </div>

          <div>
            <Label htmlFor="maxGuests">
              Máximo de invitados por confirmación
            </Label>
            <Input
              id="maxGuests"
              type="number"
              min="1"
              max="10"
              value={settings.maxGuestsPerInvite}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maxGuestsPerInvite: parseInt(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="rsvpDeadline">Fecha límite RSVP (Opcional)</Label>
            <Input
              id="rsvpDeadline"
              type="date"
              value={settings.rsvpDeadline}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  rsvpDeadline: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>


      <div className="flex space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Evento"}
        </Button>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

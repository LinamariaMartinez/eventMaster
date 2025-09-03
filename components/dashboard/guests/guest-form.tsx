"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import type { Guest } from "@/app/(dashboard)/guests/page";

interface Event {
  id: string;
  title: string;
}

interface GuestFormProps {
  initialData?: Guest;
  onSubmit: (data: Omit<Guest, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  events: Event[];
}

const commonTags = [
  "VIP",
  "Prensa",
  "Cliente",
  "Socio",
  "Ponente",
  "Asistente",
  "Networking",
];

export function GuestForm({ initialData, onSubmit, onCancel, events }: GuestFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || ("pending" as Guest["status"]),
    eventId: initialData?.eventId || "",
    guestCount: initialData?.guestCount || 1,
    message: initialData?.message || "",
    dietaryRestrictions: initialData?.dietaryRestrictions || "",
    notes: initialData?.notes || "",
    tags: initialData?.tags || [],
    customFields: initialData?.customFields || {},
  });

  const [newTag, setNewTag] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventName = events.find((e) => e.id === formData.eventId)?.title;

    onSubmit({
      ...formData,
      event_id: formData.eventId,
      guest_count: formData.guestCount,
      dietary_restrictions: formData.dietaryRestrictions,
      created_at: new Date().toISOString(),
      eventName,
    });
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addCustomField = () => {
    if (newFieldKey && newFieldValue) {
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [newFieldKey]: newFieldValue,
        },
      }));
      setNewFieldKey("");
      setNewFieldValue("");
    }
  };

  const removeCustomField = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: Object.fromEntries(
        Object.entries(prev.customFields).filter(([k]) => k !== key),
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Guest["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="declined">Rechazado</SelectItem>
                  <SelectItem value="maybe">Tal vez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="event">Evento</Label>
            <Select
              value={formData.eventId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, eventId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar evento" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Alergias, preferencias, comentarios..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Etiquetas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-destructive hover:text-destructive-foreground rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Nueva etiqueta"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag(newTag))
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTag(newTag)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonTags
              .filter((tag) => !formData.tags.includes(tag))
              .map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Campos Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData.customFields).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input value={key} disabled />
                <Input value={value} disabled />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCustomField(key)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Input
              placeholder="Campo"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
            />
            <Input
              placeholder="Valor"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={addCustomField}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Actualizar" : "Agregar"} Invitado
        </Button>
      </div>
    </form>
  );
}

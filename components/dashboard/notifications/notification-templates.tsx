"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Mail,
  Bell,
  Smartphone,
  Copy,
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  type: "email" | "push" | "sms";
  category:
    | "event_reminder"
    | "rsvp_update"
    | "guest_added"
    | "deadline"
    | "custom";
  subject: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  createdAt: string;
}

const mockTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "Recordatorio de Evento - 24h",
    type: "email",
    category: "event_reminder",
    subject: "Recordatorio: {event_name} es mañana",
    content:
      "Hola {guest_name},\n\nTe recordamos que {event_name} será mañana {event_date} a las {event_time}.\n\nUbicación: {event_location}\n\n¡Te esperamos!",
    variables: [
      "guest_name",
      "event_name",
      "event_date",
      "event_time",
      "event_location",
    ],
    isDefault: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Confirmación de RSVP",
    type: "email",
    category: "rsvp_update",
    subject: "Confirmación recibida para {event_name}",
    content:
      "Hola {guest_name},\n\nHemos recibido tu confirmación para {event_name}.\n\nDetalles del evento:\n- Fecha: {event_date}\n- Hora: {event_time}\n- Lugar: {event_location}\n\n¡Nos vemos pronto!",
    variables: [
      "guest_name",
      "event_name",
      "event_date",
      "event_time",
      "event_location",
    ],
    isDefault: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Recordatorio Push - 2h",
    type: "push",
    category: "event_reminder",
    subject: "{event_name} comienza en 2 horas",
    content:
      "No olvides que {event_name} comienza a las {event_time} en {event_location}",
    variables: ["event_name", "event_time", "event_location"],
    isDefault: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "4",
    name: "SMS Urgente",
    type: "sms",
    category: "deadline",
    subject: "",
    content:
      "URGENTE: La fecha límite para {event_name} vence hoy. Confirma tu asistencia: {rsvp_link}",
    variables: ["event_name", "rsvp_link"],
    isDefault: false,
    createdAt: "2025-01-15T10:00:00Z",
  },
];

export function NotificationTemplates() {
  const [templates, setTemplates] =
    useState<NotificationTemplate[]>(mockTemplates);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<NotificationTemplate | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesType =
      selectedType === "all" || template.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  const handleCreateTemplate = (
    templateData: Omit<NotificationTemplate, "id" | "createdAt">,
  ) => {
    const newTemplate: NotificationTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    setShowCreateDialog(false);
  };

  const handleEditTemplate = (
    templateData: Omit<NotificationTemplate, "id" | "createdAt">,
  ) => {
    if (!editingTemplate) return;

    const updatedTemplate: NotificationTemplate = {
      ...templateData,
      id: editingTemplate.id,
      createdAt: editingTemplate.createdAt,
    };

    setTemplates(
      templates.map((t) => (t.id === editingTemplate.id ? updatedTemplate : t)),
    );
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
  };

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const duplicatedTemplate: NotificationTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const getTypeIcon = (type: NotificationTemplate["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: NotificationTemplate["type"]) => {
    switch (type) {
      case "email":
        return "Email";
      case "push":
        return "Push";
      case "sms":
        return "SMS";
    }
  };

  const getCategoryLabel = (category: NotificationTemplate["category"]) => {
    switch (category) {
      case "event_reminder":
        return "Recordatorio";
      case "rsvp_update":
        return "RSVP";
      case "guest_added":
        return "Invitado";
      case "deadline":
        return "Fecha límite";
      case "custom":
        return "Personalizado";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Plantillas de Notificación
          </h2>
          <p className="text-muted-foreground">
            Crea y gestiona plantillas reutilizables para tus notificaciones.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Plantilla</DialogTitle>
            </DialogHeader>
            <TemplateForm
              onSubmit={handleCreateTemplate}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="event_reminder">Recordatorios</SelectItem>
            <SelectItem value="rsvp_update">RSVP</SelectItem>
            <SelectItem value="guest_added">Invitados</SelectItem>
            <SelectItem value="deadline">Fechas límite</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-sm font-medium">
                    {template.name}
                  </CardTitle>
                  {template.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Por defecto
                    </Badge>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    {!template.isDefault && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(template.type)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(template.category)}
                </Badge>
              </div>

              {template.subject && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    Asunto
                  </Label>
                  <p className="text-sm font-medium">{template.subject}</p>
                </div>
              )}

              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Contenido
                </Label>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.content}
                </p>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">
                  Variables disponibles
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.slice(0, 3).map((variable) => (
                    <Badge
                      key={variable}
                      variant="secondary"
                      className="text-xs"
                    >
                      {`{${variable}}`}
                    </Badge>
                  ))}
                  {template.variables.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.variables.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingTemplate}
        onOpenChange={() => setEditingTemplate(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Plantilla</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <TemplateForm
              initialData={editingTemplate}
              onSubmit={handleEditTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TemplateFormProps {
  initialData?: NotificationTemplate;
  onSubmit: (data: Omit<NotificationTemplate, "id" | "createdAt">) => void;
  onCancel: () => void;
}

function TemplateForm({ initialData, onSubmit, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || ("email" as NotificationTemplate["type"]),
    category:
      initialData?.category ||
      ("event_reminder" as NotificationTemplate["category"]),
    subject: initialData?.subject || "",
    content: initialData?.content || "",
    variables: initialData?.variables || [],
    isDefault: initialData?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const availableVariables = [
    "guest_name",
    "event_name",
    "event_date",
    "event_time",
    "event_location",
    "rsvp_link",
    "event_description",
    "organizer_name",
    "organizer_email",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre de la plantilla</Label>
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
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(value: NotificationTemplate["type"]) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={formData.category}
          onValueChange={(value: NotificationTemplate["category"]) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="event_reminder">
              Recordatorio de evento
            </SelectItem>
            <SelectItem value="rsvp_update">Actualización RSVP</SelectItem>
            <SelectItem value="guest_added">Invitado agregado</SelectItem>
            <SelectItem value="deadline">Fecha límite</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(formData.type === "email" || formData.type === "push") && (
        <div>
          <Label htmlFor="subject">Asunto</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
            }
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={6}
          required
        />
      </div>

      <div>
        <Label>Variables disponibles</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableVariables.map((variable) => (
            <Button
              key={variable}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const textarea = document.getElementById(
                  "content",
                ) as HTMLTextAreaElement;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const after = text.substring(end, text.length);
                  const newText = before + `{${variable}}` + after;
                  setFormData((prev) => ({ ...prev, content: newText }));
                  setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(
                      start + variable.length + 2,
                      start + variable.length + 2,
                    );
                  }, 0);
                }
              }}
            >
              {`{${variable}}`}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? "Actualizar" : "Crear"} Plantilla
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Guest = Database['public']['Tables']['guests']['Row'];
type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type GuestUpdate = Database['public']['Tables']['guests']['Update'];

interface GuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  guest?: Guest | null;
  onSuccess: () => void;
}

export function GuestDialog({ open, onOpenChange, eventId, guest, onSuccess }: GuestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guest_count: 1,
    message: "",
    dietary_restrictions: "",
    status: "pending" as "pending" | "confirmed" | "declined",
  });

  // Cargar datos del invitado cuando se abre en modo edición
  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name,
        email: guest.email || "",
        phone: guest.phone || "",
        guest_count: guest.guest_count,
        message: guest.message || "",
        dietary_restrictions: guest.dietary_restrictions || "",
        status: guest.status,
      });
    } else {
      // Resetear formulario cuando no hay invitado (modo añadir)
      setFormData({
        name: "",
        email: "",
        phone: "",
        guest_count: 1,
        message: "",
        dietary_restrictions: "",
        status: "pending",
      });
    }
  }, [guest, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      if (guest) {
        // Actualizar invitado existente
        const updateData: GuestUpdate = {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          guest_count: formData.guest_count,
          message: formData.message || null,
          dietary_restrictions: formData.dietary_restrictions || null,
          status: formData.status,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('guests').update as any)(updateData)
          .eq('id', guest.id);

        if (error) {
          throw error;
        }

        toast.success("Invitado actualizado exitosamente");
      } else {
        // Crear nuevo invitado
        const insertData: GuestInsert = {
          event_id: eventId,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          guest_count: formData.guest_count,
          message: formData.message || null,
          dietary_restrictions: formData.dietary_restrictions || null,
          status: formData.status,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('guests').insert as any)(insertData);

        if (error) {
          throw error;
        }

        toast.success("Invitado añadido exitosamente");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving guest:", error);
      toast.error(guest ? "Error al actualizar invitado" : "Error al añadir invitado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guest ? "Editar Invitado" : "Añadir Invitado"}</DialogTitle>
          <DialogDescription>
            {guest ? "Actualiza la información del invitado" : "Completa los datos del nuevo invitado"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre completo"
              required
            />
          </div>

          {/* Email y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>

          {/* Estado y Número de acompañantes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "confirmed" | "declined") =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="declined">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="guest_count">Número de acompañantes</Label>
              <Input
                id="guest_count"
                type="number"
                min="1"
                max="10"
                value={formData.guest_count}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_count: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Restricciones dietarias */}
          <div>
            <Label htmlFor="dietary_restrictions">Restricciones Dietarias</Label>
            <Input
              id="dietary_restrictions"
              value={formData.dietary_restrictions}
              onChange={(e) => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
              placeholder="Vegetariano, sin gluten, alergias, etc."
            />
          </div>

          {/* Mensaje/Notas */}
          <div>
            <Label htmlFor="message">Mensaje o Notas</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Comentarios adicionales..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-burgundy hover:bg-burgundy/90">
              {loading ? "Guardando..." : guest ? "Actualizar" : "Añadir"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

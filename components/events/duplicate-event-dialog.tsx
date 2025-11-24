"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/types/database.types";

type Event = Database['public']['Tables']['events']['Row'];

interface DuplicateEventDialogProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicate: (whatsappNumber: string, hostName?: string) => Promise<void>;
}

export function DuplicateEventDialog({
  event,
  open,
  onOpenChange,
  onDuplicate,
}: DuplicateEventDialogProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [hostName, setHostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDuplicate = async () => {
    if (!whatsappNumber.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onDuplicate(whatsappNumber, hostName || undefined);
      // Reset form
      setWhatsappNumber("");
      setHostName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error duplicating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Duplicar Evento</DialogTitle>
          <DialogDescription>
            Crea una copia de &quot;{event?.title}&quot; con nueva información de contacto.
            Los invitados no serán duplicados.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="whatsapp">
              Número WhatsApp <span className="text-red-500">*</span>
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+57 300 123 4567"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Número para recibir confirmaciones del nuevo evento
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hostName">
              Nombre del Anfitrión <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="hostName"
              type="text"
              placeholder="Ej: María González"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Si deseas cambiar el nombre del anfitrión en el evento duplicado
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={!whatsappNumber.trim() || isLoading}
          >
            {isLoading ? "Duplicando..." : "Duplicar Evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestList } from "@/components/dashboard/guests/guest-list 2";
import { CSVImport } from "@/components/dashboard/guests/csv-import";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Plus,
  Upload,
  Download,
  Send,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Guest } from "@/types";
import { toast } from "sonner";
import { calculateGuestStats, downloadCSV } from "@/lib/utils";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventInvitationsPage({ params }: PageProps) {
  const [showCSVImport, setShowCSVImport] = useState(false);

  // Mock data - vendría de la API
  const event = {
    id: params.id,
    title: "Boda de María y Carlos",
    date: "2025-02-15",
    time: "18:00",
    location: "Salón de Eventos Los Jardines",
  };

  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "1",
      event_id: params.id,
      name: "Ana Pérez",
      email: "ana@example.com",
      phone: "+57 300 123 4567",
      status: "confirmed",
      guest_count: 2,
      message: "Esperamos con ansias este momento especial",
      dietary_restrictions: "Vegetariana",
      created_at: "2025-01-15T10:00:00Z",
      invitedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "2",
      event_id: params.id,
      name: "Carlos García",
      email: "carlos@example.com",
      phone: "+57 301 234 5678",
      status: "pending",
      guest_count: 1,
      message: undefined,
      dietary_restrictions: undefined,
      created_at: "2025-01-16T11:30:00Z",
      invitedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "3",
      event_id: params.id,
      name: "Laura Martín",
      email: "laura@example.com",
      phone: undefined,
      status: "declined",
      guest_count: 2,
      message: "Lamentablemente no podremos asistir",
      dietary_restrictions: undefined,
      created_at: "2025-01-17T14:20:00Z",
      invitedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "4",
      event_id: params.id,
      name: "José Rodríguez",
      email: "jose@example.com",
      phone: "+57 302 345 6789",
      status: "confirmed",
      guest_count: 3,
      message: "Iremos toda la familia",
      dietary_restrictions: "Sin gluten",
      created_at: "2025-01-18T09:15:00Z",
      invitedAt: "2025-01-15T10:00:00Z",
    },
    {
      id: "5",
      event_id: params.id,
      name: "María González",
      email: undefined,
      phone: "+57 303 456 7890",
      status: "pending",
      guest_count: 1,
      message: undefined,
      dietary_restrictions: undefined,
      created_at: "2025-01-19T16:45:00Z",
      invitedAt: "2025-01-15T10:00:00Z",
    },
  ]);

  const stats = calculateGuestStats(guests);
  const totalExpectedGuests = guests.reduce(
    (sum, guest) => sum + guest.guest_count,
    0,
  );
  const confirmedGuestCount = guests
    .filter((g) => g.status === "confirmed")
    .reduce((sum, guest) => sum + guest.guest_count, 0);

  const handleImportGuests = async (
    newGuests: {
      name: string;
      email?: string;
      phone?: string;
      guest_count: number;
      message?: string;
      dietary_restrictions?: string;
    }[],
  ) => {
    // En una app real, esto haría una llamada a la API
    const guestsWithId = newGuests.map((guest, index) => ({
      ...guest,
      id: `imported_${Date.now()}_${index}`,
      event_id: params.id,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      invitedAt: new Date().toISOString(),
    }));

    setGuests((prev) => [...prev, ...guestsWithId]);
    setShowCSVImport(false);
    toast.success(`${newGuests.length} invitados importados`);
  };

  const handleEditGuest = (_guest: Guest) => {
    // Abrir modal de edición
    toast.info("Función de edición próximamente");
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm("¿Estás segura de que quieres eliminar este invitado?")) {
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.success("Invitado eliminado");
    }
  };

  const handleSendReminder = (_guestId: string) => {
    // Enviar recordatorio
    toast.success("Recordatorio enviado");
  };

  const handleExportCSV = () => {
    const exportData = guests.map((guest) => ({
      Nombre: guest.name,
      Email: guest.email || "",
      Teléfono: guest.phone || "",
      Estado: guest.status,
      Acompañantes: guest.guest_count,
      Mensaje: guest.message || "",
      "Restricciones Dietarias": guest.dietary_restrictions || "",
      "Fecha de Creación": new Date(guest.created_at).toLocaleDateString(
        "es-ES",
      ),
    }));

    downloadCSV(
      exportData,
      `invitados_${event.title.replace(/\s+/g, "_")}_${Date.now()}`,
    );
    toast.success("Lista de invitados exportada");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/events/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Evento
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">
              Gestión de Invitados
            </h1>
            <p className="text-gray-600 mt-1">
              {event.title} • {event.date}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => setShowCSVImport(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Invitado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Invitados"
          value={stats.total}
          icon={Users}
          description={`${totalExpectedGuests} personas esperadas`}
        />
        <StatsCard
          title="Confirmados"
          value={stats.confirmed}
          icon={CheckCircle}
          description={`${confirmedGuestCount} personas confirmadas`}
        />
        <StatsCard
          title="Pendientes"
          value={stats.pending}
          icon={Clock}
          description="Esperando respuesta"
        />
        <StatsCard
          title="Declinaron"
          value={stats.declined}
          icon={XCircle}
          description="No asistirán"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Send className="h-5 w-5" />
              <span>Enviar Recordatorios</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Download className="h-5 w-5" />
              <span>Exportar Lista</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span>Ver Estadísticas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <GuestList
        guests={guests}
        onEdit={handleEditGuest}
        onDelete={handleDeleteGuest}
        onSendReminder={handleSendReminder}
      />

      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport
          onImport={handleImportGuests}
          onClose={() => setShowCSVImport(false)}
        />
      )}
    </div>
  );
}

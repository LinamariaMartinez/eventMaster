"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const handleEditGuest = () => {
    // Abrir modal de edición
    toast.info("Función de edición próximamente");
  };

  const handleDeleteGuest = (guestId: string) => {
    if (confirm("¿Estás segura de que quieres eliminar este invitado?")) {
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.success("Invitado eliminado");
    }
  };

  const handleSendReminder = () => {
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
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-burgundy" />
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy">{stats.total}</div>
                <p className="text-sm text-slate-600">Total Invitados</p>
                <p className="text-xs text-slate-500">{totalExpectedGuests} personas esperadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <p className="text-sm text-slate-600">Confirmados</p>
                <p className="text-xs text-slate-500">{confirmedGuestCount} personas confirmadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-sm text-slate-600">Pendientes</p>
                <p className="text-xs text-slate-500">Esperando respuesta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
                <p className="text-sm text-slate-600">Declinaron</p>
                <p className="text-xs text-slate-500">No asistirán</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-burgundy">Lista de Invitados</CardTitle>
        </CardHeader>
        <CardContent>
          {guests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-burgundy/20">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Acompañantes</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b hover:bg-cream/20 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">{guest.name}</td>
                      <td className="py-3 px-4 text-slate-600">{guest.email}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            guest.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            guest.status === 'declined' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {guest.status === 'confirmed' ? 'Confirmado' :
                           guest.status === 'declined' ? 'Rechazado' : 'Pendiente'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{guest.guest_count || 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditGuest()}>
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteGuest(guest.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-burgundy/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay invitados</h3>
              <p className="text-slate-600 mb-4">Comienza añadiendo invitados a este evento</p>
              <Button className="bg-burgundy hover:bg-burgundy/90">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Invitado
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV Import Modal - Simple placeholder */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Importar Invitados CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" accept=".csv" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCSVImport(false)}>
                  Cancelar
                </Button>
                <Button className="bg-burgundy hover:bg-burgundy/90">
                  Importar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

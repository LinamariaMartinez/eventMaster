"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { useSupabaseGuests } from "@/hooks/use-supabase-guests";
import type { Database } from "@/types/database.types";

type SupabaseGuest = Database['public']['Tables']['guests']['Row'];
// type SupabaseEvent = Database['public']['Tables']['events']['Row'];
import { toast } from "sonner";

// Updated Guest interface to match Supabase schema
export interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: "confirmed" | "pending" | "declined";
  event_id: string;
  eventName?: string;
  guest_count: number;
  message: string | null;
  dietary_restrictions: string | null;
  created_at: string;
  // Legacy fields for compatibility
  eventId?: string;
  guestCount?: number;
  createdAt?: string;
  dietaryRestrictions?: string;
  updatedAt?: string;
  respondedAt?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export default function GuestsPage() {
  const { events, loading: eventsLoading } = useSupabaseEvents();
  const { guests: supabaseGuests, loading: guestsLoading } = useSupabaseGuests();
  const [guests, setGuests] = useState<Guest[]>([]);
  const loading = eventsLoading || guestsLoading;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Transform Supabase guests to match the legacy interface
  useEffect(() => {
    if (!guestsLoading && supabaseGuests) {
      const transformedGuests: Guest[] = supabaseGuests.map((guest: SupabaseGuest) => ({
        id: guest.id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        status: guest.status,
        event_id: guest.event_id,
        eventId: guest.event_id, // Legacy compatibility
        guest_count: guest.guest_count,
        guestCount: guest.guest_count, // Legacy compatibility
        message: guest.message,
        dietary_restrictions: guest.dietary_restrictions,
        dietaryRestrictions: guest.dietary_restrictions || undefined, // Legacy compatibility
        created_at: guest.created_at,
        createdAt: guest.created_at, // Legacy compatibility
        eventName: events.find(e => e.id === guest.event_id)?.title,
      }));
      setGuests(transformedGuests);
    }
  }, [supabaseGuests, guestsLoading, events]);

  // Filter and search guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesEvent = selectedEventId === "all" || guest.event_id === selectedEventId;
      
      const matchesStatus = statusFilter === "all" || guest.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [guests, searchTerm, selectedEventId, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredGuests.length;
    const confirmed = filteredGuests.filter(g => g.status === "confirmed").length;
    const pending = filteredGuests.filter(g => g.status === "pending").length;
    const declined = filteredGuests.filter(g => g.status === "declined").length;
    const totalPeople = filteredGuests.reduce((sum, g) => sum + (g.guest_count || 1), 0);

    return { total, confirmed, pending, declined, totalPeople };
  }, [filteredGuests]);

  // Get event name by ID
  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : "Evento no encontrado";
  };

  // Get event date by ID
  const getEventDate = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? new Date(event.date).toLocaleDateString('es-CO') : "";
  };

  // Handle export
  const handleExport = () => {
    const exportData = filteredGuests.map((guest) => ({
      Nombre: guest.name,
      Email: guest.email || "",
      Teléfono: guest.phone || "",
      Estado: guest.status,
      Evento: getEventName(guest.event_id),
      Acompañantes: guest.guest_count || 1,
      Mensaje: guest.message || "",
      "Restricciones Dietarias": guest.dietary_restrictions || "",
      "Fecha de Creación": new Date(guest.created_at).toLocaleDateString('es-CO'),
    }));

    // Simple CSV export
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invitados_${selectedEventId}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Lista de invitados exportada");
  };

  if (loading || eventsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando invitados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-cream/20 to-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Invitados</h2>
            <p className="text-slate-600 mt-1">Vista global de todos los invitados por evento</p>
          </div>
          <Button onClick={handleExport} className="bg-burgundy hover:bg-burgundy/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-burgundy/20 bg-white">
          <CardHeader className="border-b border-burgundy/10">
            <CardTitle className="text-burgundy flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-burgundy/20 focus:border-burgundy"
                  />
                </div>
              </div>

              {/* Event Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Evento</label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="border-burgundy/20 focus:border-burgundy">
                    <SelectValue placeholder="Seleccionar evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Todos los eventos
                      </span>
                    </SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.title}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-burgundy/20 focus:border-burgundy">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="declined">Rechazados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 invisible">Acciones</label>
                <Button 
                  variant="outline" 
                  className="w-full border-burgundy/20 text-burgundy hover:bg-burgundy/10"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEventId("all");
                    setStatusFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-burgundy" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-burgundy">{stats.total}</div>
                  <p className="text-sm text-slate-600">Total Invitados</p>
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
                  <p className="text-sm text-slate-600">Rechazados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalPeople}</div>
                  <p className="text-sm text-slate-600">Total Personas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guests Table */}
        <Card className="border-burgundy/20 bg-white">
          <CardHeader className="border-b border-burgundy/10">
            <CardTitle className="text-burgundy">
              Lista de Invitados
              {selectedEventId !== "all" && (
                <span className="text-sm text-slate-600 font-normal ml-2">
                  - {getEventName(selectedEventId)}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredGuests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-burgundy/5 border-b border-burgundy/10">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Invitado</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Evento</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Estado</th>
                      <th className="text-left py-4 px-6 font-semibold text-slate-700">Contacto</th>
                      <th className="text-center py-4 px-6 font-semibold text-slate-700">Personas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest, index) => (
                      <tr 
                        key={guest.id} 
                        className={`border-b hover:bg-cream/20 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-burgundy/10 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-burgundy" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{guest.name}</div>
                              {guest.message && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>Tiene mensaje</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-slate-900">{getEventName(guest.event_id)}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {getEventDate(guest.event_id)}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <Badge 
                            className={
                              guest.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                              guest.status === 'declined' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {guest.status === 'confirmed' ? 'Confirmado' :
                             guest.status === 'declined' ? 'Rechazado' : 'Pendiente'}
                          </Badge>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {guest.email && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-48">{guest.email}</span>
                              </div>
                            )}
                            {guest.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="h-3 w-3" />
                                <span>{guest.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-burgundy/10 text-burgundy rounded-full text-sm font-semibold">
                            {guest.guest_count || 1}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-burgundy/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {guests.length === 0 ? "No hay invitados" : "No se encontraron invitados"}
                </h3>
                <p className="text-slate-600 mb-4">
                  {guests.length === 0 
                    ? "Los invitados aparecerán aquí cuando se añadan a los eventos" 
                    : "Prueba con diferentes filtros para encontrar invitados"
                  }
                </p>
                {searchTerm || selectedEventId !== "all" || statusFilter !== "all" ? (
                  <Button 
                    variant="outline" 
                    className="border-burgundy/20 text-burgundy hover:bg-burgundy/10"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedEventId("all");
                      setStatusFilter("all");
                    }}
                  >
                    Limpiar filtros
                  </Button>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
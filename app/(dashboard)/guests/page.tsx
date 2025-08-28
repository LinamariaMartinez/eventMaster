"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { GuestList } from "@/components/dashboard/guests/guest-list";
import { GuestForm } from "@/components/dashboard/guests/guest-form";
import { ImportExportPanel } from "@/components/dashboard/guests/import-export-panel";
import { GuestStats } from "@/components/dashboard/guests/guest-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Users } from "lucide-react";

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "confirmed" | "declined" | "maybe";
  eventId?: string;
  eventName?: string;
  invitedAt: string;
  respondedAt?: string;
  notes?: string;
  tags: string[];
  customFields: Record<string, string>;
}

// Mock guest data
const mockGuests: Guest[] = [
  {
    id: "1",
    name: "María García",
    email: "maria@email.com",
    phone: "+34 600 123 456",
    status: "confirmed",
    eventId: "evt1",
    eventName: "Cena de Gala 2025",
    invitedAt: "2025-01-15T10:00:00Z",
    respondedAt: "2025-01-16T14:30:00Z",
    notes: "Vegetariana, alergia a frutos secos",
    tags: ["VIP", "Prensa"],
    customFields: { empresa: "Tech Corp", cargo: "CEO" },
  },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: "+34 600 234 567",
    status: "pending",
    eventId: "evt1",
    eventName: "Cena de Gala 2025",
    invitedAt: "2025-01-15T10:00:00Z",
    tags: ["Cliente"],
    customFields: { empresa: "Design Studio", cargo: "Director" },
  },
  {
    id: "3",
    name: "Ana López",
    email: "ana@email.com",
    phone: "+34 600 345 678",
    status: "declined",
    eventId: "evt2",
    eventName: "Conferencia Tech",
    invitedAt: "2025-01-10T09:00:00Z",
    respondedAt: "2025-01-12T16:45:00Z",
    notes: "Conflicto de agenda",
    tags: ["Ponente"],
    customFields: { empresa: "Innovation Lab", cargo: "CTO" },
  },
  {
    id: "4",
    name: "Carlos Ruiz",
    email: "carlos@email.com",
    status: "maybe",
    eventId: "evt1",
    eventName: "Cena de Gala 2025",
    invitedAt: "2025-01-15T10:00:00Z",
    tags: ["Socio"],
    customFields: { empresa: "Business Partners", cargo: "Socio" },
  },
  {
    id: "5",
    name: "Laura Martín",
    email: "laura@email.com",
    phone: "+34 600 456 789",
    status: "confirmed",
    eventId: "evt2",
    eventName: "Conferencia Tech",
    invitedAt: "2025-01-10T09:00:00Z",
    respondedAt: "2025-01-11T11:20:00Z",
    tags: ["Asistente", "Networking"],
    customFields: { empresa: "StartupXYZ", cargo: "Fundadora" },
  },
];

export default function InvitadosPage() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || guest.status === statusFilter;
    const matchesEvent = eventFilter === "all" || guest.eventId === eventFilter;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Get unique events for filter
  const events = Array.from(
    new Set(guests.map((g) => g.eventId).filter(Boolean)),
  ).map((eventId) => {
    const guest = guests.find((g) => g.eventId === eventId);
    return { id: eventId, name: guest?.eventName || `Evento ${eventId}` };
  });

  const handleAddGuest = (guestData: Omit<Guest, "id" | "invitedAt">) => {
    const newGuest: Guest = {
      ...guestData,
      id: Date.now().toString(),
      invitedAt: new Date().toISOString(),
    };
    setGuests([...guests, newGuest]);
    setShowAddDialog(false);
  };

  const handleEditGuest = (guestData: Omit<Guest, "id" | "invitedAt">) => {
    if (!editingGuest) return;

    const updatedGuest: Guest = {
      ...guestData,
      id: editingGuest.id,
      invitedAt: editingGuest.invitedAt,
    };

    setGuests(guests.map((g) => (g.id === editingGuest.id ? updatedGuest : g)));
    setEditingGuest(null);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter((g) => g.id !== guestId));
    setSelectedGuests(selectedGuests.filter((id) => id !== guestId));
  };

  const handleBulkStatusUpdate = (status: Guest["status"]) => {
    setGuests(
      guests.map((g) =>
        selectedGuests.includes(g.id)
          ? { ...g, status, respondedAt: new Date().toISOString() }
          : g,
      ),
    );
    setSelectedGuests([]);
  };

  const handleImportGuests = (importedGuests: Guest[]) => {
    setGuests([...guests, ...importedGuests]);
  };

  const getStatusStats = () => {
    const stats = guests.reduce(
      (acc, guest) => {
        acc[guest.status] = (acc[guest.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: guests.length,
      confirmed: stats.confirmed || 0,
      pending: stats.pending || 0,
      declined: stats.declined || 0,
      maybe: stats.maybe || 0,
    };
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Gestión de Invitados
            </h1>
            <p className="text-muted-foreground">
              Administra tu lista de invitados y sus respuestas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Invitado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Invitado</DialogTitle>
                </DialogHeader>
                <GuestForm
                  onSubmit={handleAddGuest}
                  onCancel={() => setShowAddDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-border">
          <GuestStats stats={getStatusStats()} />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Filters and Actions */}
          <div className="w-80 border-r border-border p-4 space-y-6 overflow-y-auto">
            {/* Search */}
            <div>
              <h3 className="text-sm font-medium mb-2">Buscar Invitados</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o etiqueta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Filtrar por Estado</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="declined">Rechazados</SelectItem>
                    <SelectItem value="maybe">Tal vez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Filtrar por Evento</h3>
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los eventos</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id!}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedGuests.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  Acciones Masivas ({selectedGuests.length} seleccionados)
                </h3>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleBulkStatusUpdate("confirmed")}
                  >
                    Marcar como Confirmados
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleBulkStatusUpdate("declined")}
                  >
                    Marcar como Rechazados
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSelectedGuests([])}
                  >
                    Deseleccionar Todo
                  </Button>
                </div>
              </div>
            )}

            {/* Import/Export */}
            <ImportExportPanel
              guests={filteredGuests}
              onImport={handleImportGuests}
            />
          </div>

          {/* Right Panel - Guest List */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="list" className="h-full flex flex-col">
              <div className="border-b border-border px-6 py-2">
                <TabsList>
                  <TabsTrigger value="list" className="gap-2">
                    <Users className="h-4 w-4" />
                    Lista ({filteredGuests.length})
                  </TabsTrigger>
                  <TabsTrigger value="cards">Vista de Tarjetas</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="list" className="flex-1 overflow-hidden m-0">
                <GuestList
                  guests={filteredGuests}
                  selectedGuests={selectedGuests}
                  onSelectionChange={setSelectedGuests}
                  onEdit={setEditingGuest}
                  onDelete={handleDeleteGuest}
                />
              </TabsContent>

              <TabsContent
                value="cards"
                className="flex-1 overflow-y-auto m-0 p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="p-4 border border-border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{guest.name}</h4>
                        <Badge
                          variant={
                            guest.status === "confirmed"
                              ? "default"
                              : guest.status === "declined"
                                ? "destructive"
                                : guest.status === "maybe"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {guest.status === "confirmed"
                            ? "Confirmado"
                            : guest.status === "declined"
                              ? "Rechazado"
                              : guest.status === "maybe"
                                ? "Tal vez"
                                : "Pendiente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {guest.email}
                      </p>
                      {guest.phone && (
                        <p className="text-sm text-muted-foreground">
                          {guest.phone}
                        </p>
                      )}
                      {guest.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {guest.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingGuest}
          onOpenChange={() => setEditingGuest(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Invitado</DialogTitle>
            </DialogHeader>
            {editingGuest && (
              <GuestForm
                initialData={editingGuest}
                onSubmit={handleEditGuest}
                onCancel={() => setEditingGuest(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

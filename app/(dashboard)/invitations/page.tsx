"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Settings,
  Copy,
  ExternalLink,
  Heart,
  Cake,
  Briefcase,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import type { EventType } from "@/types/invitation-blocks";
import { formatEventDate } from "@/lib/utils/date";

export default function InvitationsPage() {
  const { events, loading } = useSupabaseEvents();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = async (eventId: string) => {
    const fullUrl = `${window.location.origin}/invite/${eventId}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(eventId);
    toast.success("URL copiada al portapapeles");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEventTypeIcon = (settings: unknown) => {
    try {
      const eventType = (settings as { eventType?: EventType })?.eventType;
      switch (eventType) {
        case 'wedding':
          return <Heart className="h-5 w-5 text-red-600" />;
        case 'birthday':
          return <Cake className="h-5 w-5 text-pink-600" />;
        case 'corporate':
          return <Briefcase className="h-5 w-5 text-blue-600" />;
        default:
          return <Calendar className="h-5 w-5 text-gray-600" />;
      }
    } catch {
      return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventTypeName = (settings: unknown) => {
    try {
      const eventType = (settings as { eventType?: EventType })?.eventType;
      switch (eventType) {
        case 'wedding':
          return 'Boda';
        case 'birthday':
          return 'Cumpleaños';
        case 'corporate':
          return 'Corporativo';
        default:
          return 'Sin configurar';
      }
    } catch {
      return 'Sin configurar';
    }
  };

  const hasInvitationConfig = (settings: unknown) => {
    try {
      return !!(settings as { eventType?: EventType })?.eventType;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Invitaciones</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invitaciones</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona las invitaciones de tus eventos
            </p>
          </div>
          <Link href="/events/new">
            <Button className="bg-burgundy hover:bg-burgundy/90">
              Crear Nuevo Evento
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Eventos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Invitaciones Configuradas
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => hasInvitationConfig(e.settings)).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sin Configurar
              </CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => !hasInvitationConfig(e.settings)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invitations Grid */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay eventos creados</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primer evento para empezar a gestionar invitaciones
              </p>
              <Link href="/events/new">
                <Button className="bg-burgundy hover:bg-burgundy/90">
                  Crear Primer Evento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const configured = hasInvitationConfig(event.settings);
              const eventType = getEventTypeName(event.settings);
              const icon = getEventTypeIcon(event.settings);

              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-burgundy/10 to-cream/20 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {icon}
                        <Badge variant={configured ? "default" : "secondary"}>
                          {eventType}
                        </Badge>
                      </div>
                      {configured ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Configurada
                        </Badge>
                      ) : (
                        <Badge variant="outline">Sin configurar</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mt-3">{event.title}</CardTitle>
                    <CardDescription>
                      {formatEventDate(event.date, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} • {event.time}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description || event.location}
                    </p>

                    <div className="flex flex-col gap-2">
                      {/* Configure Button */}
                      {!configured && (
                        <Link href={`/events/${event.id}/invitation-setup`} className="w-full">
                          <Button variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar Invitación
                          </Button>
                        </Link>
                      )}

                      {/* Edit Config Button */}
                      {configured && (
                        <Link href={`/events/${event.id}/invitation-setup`} className="w-full">
                          <Button variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Editar Configuración
                          </Button>
                        </Link>
                      )}

                      {/* View Public Invitation */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/invite/${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyUrl(event.id)}
                          className="w-full"
                        >
                          {copiedId === event.id ? (
                            <>✓ Copiado</>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar URL
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* URL Preview */}
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-hidden">
                      <span className="opacity-50">URL:</span> /invite/{event.id.slice(0, 8)}...
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

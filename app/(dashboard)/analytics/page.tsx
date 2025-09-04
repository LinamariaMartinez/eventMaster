"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { OverviewStats } from "@/components/dashboard/analytics/overview-stats";
import { EventPerformanceChart } from "@/components/dashboard/analytics/event-performance-chart";
import { GuestResponseChart } from "@/components/dashboard/analytics/guest-response-chart";
import { InvitationTrendsChart } from "@/components/dashboard/analytics/invitation-trends-chart";
import { TopEventsTable } from "@/components/dashboard/analytics/top-events-table";
import { ExportReports } from "@/components/dashboard/analytics/export-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingUp, Users, BarChart3 } from "lucide-react";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { useSupabaseGuests } from "@/hooks/use-supabase-guests";

export default function EstadisticasPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const { events } = useSupabaseEvents();
  const { guests } = useSupabaseGuests();

  // Calculate real stats from Supabase data
  const realStats = useMemo(() => {
    const now = new Date();
    const confirmedGuests = guests.filter(g => g.status === 'confirmed');
    const declinedGuests = guests.filter(g => g.status === 'declined');
    
    // Categorize events by date
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date + 'T' + event.time);
      return eventDate > now;
    });
    
    const completedEvents = events.filter(event => {
      const eventDate = new Date(event.date + 'T' + event.time);
      return eventDate < now;
    });

    const totalGuests = guests.length;
    const responseRate = totalGuests > 0 ? Math.round(((confirmedGuests.length + declinedGuests.length) / totalGuests) * 100) : 0;
    const confirmationRate = totalGuests > 0 ? Math.round((confirmedGuests.length / totalGuests) * 100) : 0;

    return {
      totalEvents: events.length,
      totalGuests: totalGuests,
      totalInvitations: totalGuests, // Assuming 1:1 guest to invitation ratio
      avgResponseRate: responseRate,
      avgConfirmationRate: confirmationRate,
      activeEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
      upcomingEvents: upcomingEvents.length,
    };
  }, [events, guests]);

  // Calculate event performance from real data
  const realEventPerformance = useMemo(() => {
    return events.map(event => {
      const eventGuests = guests.filter(g => g.event_id === event.id);
      const confirmed = eventGuests.filter(g => g.status === 'confirmed').length;
      const declined = eventGuests.filter(g => g.status === 'declined').length;
      const pending = eventGuests.filter(g => g.status === 'pending').length;
      const responseRate = eventGuests.length > 0 ? Math.round(((confirmed + declined) / eventGuests.length) * 100) : 0;
      
      return {
        name: event.title,
        guests: eventGuests.length,
        confirmed: confirmed,
        declined: declined,
        pending: pending,
        responseRate: responseRate,
      };
    }).sort((a, b) => b.guests - a.guests); // Sort by most guests
  }, [events, guests]);

  // Generate trends data based on events creation dates
  const realTrendsData = useMemo(() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      
      const monthGuests = guests.filter(guest => {
        const guestDate = new Date(guest.created_at);
        return guestDate.getMonth() === date.getMonth() && guestDate.getFullYear() === date.getFullYear();
      });
      
      const responses = monthGuests.filter(g => g.status !== 'pending').length;
      const confirmations = monthGuests.filter(g => g.status === 'confirmed').length;
      
      last6Months.push({
        month: months[date.getMonth()],
        invitations: monthGuests.length,
        responses: responses,
        confirmations: confirmations,
      });
    }
    
    return last6Months;
  }, [guests]);

  // Calculate response distribution
  const realResponseData = useMemo(() => {
    const confirmedGuests = guests.filter(g => g.status === 'confirmed').length;
    const pendingGuests = guests.filter(g => g.status === 'pending').length;
    const declinedGuests = guests.filter(g => g.status === 'declined').length;
    const total = guests.length || 1; // Avoid division by zero
    
    return [
      { name: "Confirmados", value: Math.round((confirmedGuests / total) * 100), color: "#22c55e" },
      { name: "Pendientes", value: Math.round((pendingGuests / total) * 100), color: "#f59e0b" },
      { name: "Rechazados", value: Math.round((declinedGuests / total) * 100), color: "#ef4444" },
    ].filter(item => item.value > 0); // Only show non-zero values
  }, [guests]);
  // Removed unused selectedMetric state

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-gradient-to-br from-cream/20 to-white">
        {/* Header mejorado */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-burgundy to-burgundy/90 text-white">
          <div>
            <h1 className="text-3xl font-bold">
              Análisis Detallado
            </h1>
            <p className="text-burgundy-100 mt-1">
              Métricas completas y exportación de datos de tus eventos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-accessible-dark border-white/40 text-white select-trigger-accessible">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content-accessible">
                <SelectItem value="1m" className="select-item-accessible">Último mes</SelectItem>
                <SelectItem value="3m" className="select-item-accessible">3 meses</SelectItem>
                <SelectItem value="6m" className="select-item-accessible">6 meses</SelectItem>
                <SelectItem value="1y" className="select-item-accessible">1 año</SelectItem>
                <SelectItem value="all" className="select-item-accessible">Todo el tiempo</SelectItem>
              </SelectContent>
            </Select>
            <div className="bg-accessible-dark rounded-lg p-1">
              <ExportReports />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="p-6 bg-white border-b border-burgundy/10">
          <OverviewStats stats={realStats} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="overview" className="h-full">
            <div className="bg-white border-b border-burgundy/10 px-6 py-4 shadow-sm">
              <TabsList className="bg-burgundy/5 border border-burgundy/20">
                <TabsTrigger 
                  value="overview" 
                  className="gap-2 data-[state=active]:bg-burgundy data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  Resumen General
                </TabsTrigger>
                <TabsTrigger 
                  value="events" 
                  className="gap-2 data-[state=active]:bg-burgundy data-[state=active]:text-white"
                >
                  <CalendarDays className="h-4 w-4" />
                  Rendimiento de Eventos
                </TabsTrigger>
                <TabsTrigger 
                  value="guests" 
                  className="gap-2 data-[state=active]:bg-burgundy data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  Análisis de Invitados
                </TabsTrigger>
                <TabsTrigger 
                  value="trends" 
                  className="gap-2 data-[state=active]:bg-burgundy data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4" />
                  Tendencias
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GuestResponseChart data={realResponseData} />
                <InvitationTrendsChart data={realTrendsData.slice(-3)} />
              </div>
              <TopEventsTable events={realEventPerformance.slice(0, 5)} />
            </TabsContent>

            <TabsContent value="events" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <EventPerformanceChart events={realEventPerformance} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Eventos por Estado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Activos</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{
                                  width: `${realStats.totalEvents > 0 ? (realStats.activeEvents / realStats.totalEvents) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {realStats.activeEvents}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completados</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{
                                  width: `${realStats.totalEvents > 0 ? (realStats.completedEvents / realStats.totalEvents) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {realStats.completedEvents}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Próximos</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500"
                                style={{
                                  width: `${realStats.totalEvents > 0 ? (realStats.upcomingEvents / realStats.totalEvents) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {realStats.upcomingEvents}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        Métricas Promedio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tasa de Respuesta</span>
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            {realStats.avgResponseRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tasa de Confirmación</span>
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-800"
                          >
                            {realStats.avgConfirmationRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Invitados por Evento</span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              realStats.totalEvents > 0 ? realStats.totalGuests / realStats.totalEvents : 0,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Invitaciones por Evento
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              realStats.totalEvents > 0 ? realStats.totalInvitations /
                                realStats.totalEvents : 0,
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guests" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GuestResponseChart data={realResponseData} />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Segmentación de Invitados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          label: "VIP",
                          count: 156,
                          percentage: 12.5,
                          color: "bg-purple-500",
                        },
                        {
                          label: "Clientes",
                          count: 423,
                          percentage: 33.9,
                          color: "bg-blue-500",
                        },
                        {
                          label: "Socios",
                          count: 234,
                          percentage: 18.8,
                          color: "bg-green-500",
                        },
                        {
                          label: "Prensa",
                          count: 89,
                          percentage: 7.1,
                          color: "bg-yellow-500",
                        },
                        {
                          label: "Otros",
                          count: 345,
                          percentage: 27.7,
                          color: "bg-gray-500",
                        },
                      ].map((segment) => (
                        <div
                          key={segment.label}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${segment.color}`}
                            />
                            <span className="text-sm">{segment.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {segment.percentage}%
                            </span>
                            <span className="text-sm font-medium">
                              {segment.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Tiempo de Respuesta Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">2.3</p>
                      <p className="text-sm text-muted-foreground">
                        días (Confirmados)
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">4.1</p>
                      <p className="text-sm text-muted-foreground">
                        días (Rechazados)
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">3.2</p>
                      <p className="text-sm text-muted-foreground">
                        días (Tal vez)
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">
                        -
                      </p>
                      <p className="text-sm text-muted-foreground">
                        días (Pendientes)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="m-0 p-6 space-y-6">
              <InvitationTrendsChart data={realTrendsData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Crecimiento Mensual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevos Eventos</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            +23%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Invitaciones Enviadas</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            +18%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tasa de Respuesta</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            +5%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevos Invitados</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            +31%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Predicciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-900">
                          Próximo Mes
                        </p>
                        <p className="text-xs text-blue-700">
                          Se esperan ~450 invitaciones basado en tendencias
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <p className="text-sm font-medium text-green-900">
                          Tasa de Confirmación
                        </p>
                        <p className="text-xs text-green-700">
                          Proyección del 68% para eventos futuros
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm font-medium text-yellow-900">
                          Recomendación
                        </p>
                        <p className="text-xs text-yellow-700">
                          Enviar recordatorios 3 días antes del evento
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
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

// Mock data for statistics
const mockStats = {
  totalEvents: 24,
  totalGuests: 1247,
  totalInvitations: 2156,
  avgResponseRate: 78,
  avgConfirmationRate: 65,
  activeEvents: 8,
  completedEvents: 16,
  upcomingEvents: 3,
};

const mockEventPerformance = [
  {
    name: "Cena de Gala 2025",
    guests: 150,
    confirmed: 120,
    declined: 20,
    pending: 10,
    responseRate: 93,
  },
  {
    name: "Conferencia Tech",
    guests: 300,
    confirmed: 180,
    declined: 80,
    pending: 40,
    responseRate: 87,
  },
  {
    name: "Networking Empresarial",
    guests: 80,
    confirmed: 65,
    declined: 10,
    pending: 5,
    responseRate: 94,
  },
  {
    name: "Lanzamiento Producto",
    guests: 200,
    confirmed: 140,
    declined: 35,
    pending: 25,
    responseRate: 88,
  },
  {
    name: "Workshop Innovación",
    guests: 50,
    confirmed: 42,
    declined: 5,
    pending: 3,
    responseRate: 94,
  },
];

const mockTrendsData = [
  { month: "Ene", invitations: 180, responses: 145, confirmations: 120 },
  { month: "Feb", invitations: 220, responses: 185, confirmations: 150 },
  { month: "Mar", invitations: 280, responses: 235, confirmations: 190 },
  { month: "Apr", invitations: 320, responses: 275, confirmations: 220 },
  { month: "May", invitations: 380, responses: 310, confirmations: 250 },
  { month: "Jun", invitations: 420, responses: 350, confirmations: 280 },
];

const mockResponseData = [
  { name: "Confirmados", value: 65, color: "#22c55e" },
  { name: "Pendientes", value: 13, color: "#f59e0b" },
  { name: "Rechazados", value: 15, color: "#ef4444" },
  { name: "Tal vez", value: 7, color: "#3b82f6" },
];

export default function EstadisticasPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [_selectedMetric, _setSelectedMetric] = useState("all");

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Estadísticas y Análisis
            </h1>
            <p className="text-muted-foreground">
              Métricas de rendimiento de tus eventos e invitaciones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Último mes</SelectItem>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
                <SelectItem value="all">Todo el tiempo</SelectItem>
              </SelectContent>
            </Select>
            <ExportReports />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="p-6 border-b border-border">
          <OverviewStats stats={mockStats} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="overview" className="h-full">
            <div className="border-b border-border px-6 py-2">
              <TabsList>
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Resumen General
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Rendimiento de Eventos
                </TabsTrigger>
                <TabsTrigger value="guests" className="gap-2">
                  <Users className="h-4 w-4" />
                  Análisis de Invitados
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tendencias
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GuestResponseChart data={mockResponseData} />
                <InvitationTrendsChart data={mockTrendsData.slice(-3)} />
              </div>
              <TopEventsTable events={mockEventPerformance.slice(0, 5)} />
            </TabsContent>

            <TabsContent value="events" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <EventPerformanceChart events={mockEventPerformance} />
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
                                  width: `${(mockStats.activeEvents / mockStats.totalEvents) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {mockStats.activeEvents}
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
                                  width: `${(mockStats.completedEvents / mockStats.totalEvents) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {mockStats.completedEvents}
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
                                  width: `${(mockStats.upcomingEvents / mockStats.totalEvents) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {mockStats.upcomingEvents}
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
                            {mockStats.avgResponseRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tasa de Confirmación</span>
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-800"
                          >
                            {mockStats.avgConfirmationRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Invitados por Evento</span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              mockStats.totalGuests / mockStats.totalEvents,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Invitaciones por Evento
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              mockStats.totalInvitations /
                                mockStats.totalEvents,
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
                <GuestResponseChart data={mockResponseData} />
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
              <InvitationTrendsChart data={mockTrendsData} />
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

"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Mail, TrendingUp, Clock, MapPin } from "lucide-react";
import { eventStorage, guestStorage } from "@/lib/storage";
import { useEventsStorage } from "@/hooks/use-events-storage";


export default function DashboardPage() {
  const { events, loading } = useEventsStorage();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalInvitations: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    if (!loading && events.length > 0) {
      const allGuests = guestStorage.getAll();
      const totalGuests = events.reduce((sum, event) => {
        const eventGuests = allGuests.filter(guest => guest.eventId === event.id);
        return sum + eventGuests.length;
      }, 0);
      
      const confirmedGuests = events.reduce((sum, event) => {
        return sum + (event.confirmedGuests || 0);
      }, 0);
      
      const upcomingEventsCount = events.filter(event => 
        new Date(event.date) > new Date() && event.status === 'published'
      ).length;
      
      setStats({
        totalEvents: events.length,
        totalGuests,
        totalInvitations: totalGuests,
        upcomingEvents: upcomingEventsCount
      });
    }
  }, [events, loading]);

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date() && event.status === 'published')
    .sort((a, b) => new Date(event.date).getTime() - new Date(event.date).getTime())
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingEvents} próximos eventos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-xs text-muted-foreground">
              En todos los eventos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invitaciones Enviadas</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvitations}</div>
            <p className="text-xs text-muted-foreground">
              Total de invitaciones
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Promedio de confirmación
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos programados para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString('es-CO')}</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.confirmedGuests || 0} confirmados
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No hay eventos próximos</p>
                <p className="text-xs text-muted-foreground">Crea tu primer evento para comenzar</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nuevo evento creado</p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Invitaciones enviadas</p>
                  <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Confirmación recibida</p>
                  <p className="text-xs text-muted-foreground">Hace 1 día</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

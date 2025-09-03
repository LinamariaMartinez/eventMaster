"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Mail, TrendingUp, Clock, MapPin, Plus, Eye, BarChart3 } from "lucide-react";
import { useSupabaseEvents } from "@/hooks/use-supabase-events";
import { useSupabaseGuests } from "@/hooks/use-supabase-guests";
import { useAuth } from "@/hooks/use-auth";
import { AuthStatus } from "@/components/debug/auth-status";
import Link from "next/link";


export default function DashboardPage() {
  // All hooks must be called before any conditional returns
  const { user, isAuthenticated, loading: authLoading, redirectToLogin } = useAuth();
  const { events, loading: eventsLoading } = useSupabaseEvents();
  const { guests, loading: guestsLoading } = useSupabaseGuests();
  
  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('[DashboardPage] User not authenticated, redirecting to login');
      redirectToLogin();
    }
  }, [authLoading, isAuthenticated, redirectToLogin]);
  
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGuests: 0,
    totalInvitations: 0,
    upcomingEvents: 0
  });
  
  const loading = authLoading || eventsLoading || guestsLoading;

  useEffect(() => {
    if (!loading && events.length >= 0) {
      const totalGuests = guests.length;
      
      const upcomingEventsCount = events.filter(event => 
        new Date(event.date) > new Date()
      ).length;
      
      setStats({
        totalEvents: events.length,
        totalGuests,
        totalInvitations: totalGuests,
        upcomingEvents: upcomingEventsCount
      });
    }
  }, [events, guests, loading]);

  // Show loading while checking authentication or loading data
  if (loading || !isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">
              {authLoading ? 'Verificando autenticación...' : 'Cargando dashboard...'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map(event => ({
      ...event,
      confirmedGuests: guests.filter(g => g.event_id === event.id && g.status === 'confirmed').length
    }));

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header con acciones rápidas */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenida</h2>
            <p className="text-slate-600 mt-1">
              Resumen ejecutivo de tus eventos
              {user && (
                <span className="block text-sm text-burgundy font-medium mt-1">
                  {user.user_metadata?.name || user.email}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/events/new">
              <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Análisis
              </Button>
            </Link>
          </div>
        </div>
      
      {/* Métricas principales - más visual y simplificado */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Eventos Totales</CardTitle>
            <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy">{stats.totalEvents}</div>
            <p className="text-sm text-slate-600 mt-1">
              {stats.upcomingEvents} próximos
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Invitados</CardTitle>
            <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy">{stats.totalGuests}</div>
            <p className="text-sm text-slate-600 mt-1">
              Todos los eventos
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Invitaciones</CardTitle>
            <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy">{stats.totalInvitations}</div>
            <p className="text-sm text-slate-600 mt-1">
              Enviadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-burgundy bg-gradient-to-r from-cream/20 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Confirmaciones</CardTitle>
            <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-burgundy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy">85%</div>
            <p className="text-sm text-slate-600 mt-1">
              Tasa promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos eventos - sección principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-burgundy/20 bg-gradient-to-r from-cream/10 to-white">
          <CardHeader className="border-b border-burgundy/10">
            <CardTitle className="text-burgundy flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Eventos que requieren tu atención
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id} className="group flex items-center justify-between p-4 rounded-lg bg-white border border-burgundy/10 hover:border-burgundy/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString('es-CO')}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-burgundy">{event.confirmedGuests}</div>
                        <div className="text-xs text-slate-600">confirmados</div>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-burgundy/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay eventos próximos</h3>
                <p className="text-slate-600 mb-4">Crea tu primer evento para comenzar</p>
                <Link href="/events/new">
                  <Button className="bg-burgundy hover:bg-burgundy/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-burgundy/20 bg-gradient-to-b from-cream/10 to-white">
          <CardHeader className="border-b border-burgundy/10">
            <CardTitle className="text-burgundy text-sm">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Link href="/events/new" className="block">
              <div className="p-4 rounded-lg bg-white border border-burgundy/10 hover:border-burgundy/30 hover:bg-burgundy/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-burgundy/20">
                    <Plus className="h-5 w-5 text-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Nuevo Evento</h3>
                    <p className="text-sm text-slate-600">Crear evento nuevo</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/invitations" className="block">
              <div className="p-4 rounded-lg bg-white border border-burgundy/10 hover:border-burgundy/30 hover:bg-burgundy/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-burgundy/20">
                    <Mail className="h-5 w-5 text-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Invitaciones</h3>
                    <p className="text-sm text-slate-600">Gestionar invitaciones</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/analytics" className="block">
              <div className="p-4 rounded-lg bg-white border border-burgundy/10 hover:border-burgundy/30 hover:bg-burgundy/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-burgundy/10 rounded-full flex items-center justify-center group-hover:bg-burgundy/20">
                    <BarChart3 className="h-5 w-5 text-burgundy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Estadísticas</h3>
                    <p className="text-sm text-slate-600">Ver análisis detallado</p>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
        </div>
        
        {/* Debug: Auth Status - Remove this in production */}
        <div className="fixed bottom-4 right-4">
          <AuthStatus />
        </div>
      </div>
    </DashboardLayout>
  );
}

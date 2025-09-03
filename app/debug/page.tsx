"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getCurrentUser,
  signOut,
  AuthUser
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface DebugInfo {
  currentUser: AuthUser | null;
  hasUser: boolean;
  userEmail?: string;
  userId?: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const refreshDebugInfo = async () => {
    setIsLoading(true);
    try {
      console.log('[DebugPage] Refreshing debug info...');
      const user = await getCurrentUser();
      
      const info: DebugInfo = {
        currentUser: user,
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.id
      };
      
      console.log('[DebugPage] Debug info:', info);
      setDebugInfo(info);
    } catch (error) {
      console.error('[DebugPage] Error refreshing debug info:', error);
      toast.error("Error obteniendo información de debug");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('[DebugPage] Logging out...');
      await signOut();
      toast.success("Logout completado");
      router.push('/');
    } catch (error) {
      console.error('[DebugPage] Logout error:', error);
      toast.error("Error durante logout");
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Debug Authentication</h1>
        <div className="flex gap-2">
          <Button onClick={refreshDebugInfo} disabled={isLoading} variant="outline">
            {isLoading ? "Cargando..." : "Refresh"}
          </Button>
          <Button onClick={handleGoToLogin} variant="secondary">
            Ir a Login
          </Button>
          <Button onClick={handleGoToDashboard}>
            Ir a Dashboard
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Usuario Actual
              <Badge variant={debugInfo?.hasUser ? "default" : "destructive"}>
                {debugInfo?.hasUser ? "Autenticado" : "No Autenticado"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debugInfo ? (
              <div className="space-y-2">
                {debugInfo.hasUser ? (
                  <>
                    <p><strong>ID:</strong> {debugInfo.userId}</p>
                    <p><strong>Email:</strong> {debugInfo.userEmail}</p>
                    <Button onClick={handleLogout} variant="destructive" size="sm">
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">No hay usuario autenticado</p>
                )}
              </div>
            ) : (
              <p>Cargando información del usuario...</p>
            )}
          </CardContent>
        </Card>

        {/* Authentication Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Autenticación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleGoToLogin} variant="outline">
                Página de Login
              </Button>
              <Button onClick={handleGoToDashboard} variant="outline">
                Dashboard (requiere auth)
              </Button>
              <Button onClick={refreshDebugInfo} disabled={isLoading}>
                Refrescar Estado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navegación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="link">Inicio</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="link">Dashboard</Button>
              </Link>
              <Link href="/login">
                <Button variant="link">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="link">Registro</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
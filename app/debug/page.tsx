"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  debugSessions, 
  cleanDemoSession, 
  hasDemoSession, 
  getCurrentUser,
  signOut,
  AuthUser
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface DebugInfo {
  localStorage: {
    demo_user: string | null;
    demo_session: {
      user?: AuthUser;
      expires_at?: number;
      access_token?: string;
    } | null;
  };
  cookies: string;
  hasDemoSession: boolean;
  error?: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const refreshDebugInfo = async () => {
    setIsLoading(true);
    try {
      const info = debugSessions();
      const user = await getCurrentUser();
      setDebugInfo(info as DebugInfo);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error refreshing debug info:", error);
      toast.error("Error obteniendo información de debug");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const handleCleanSessions = () => {
    cleanDemoSession();
    toast.success("Sesiones demo limpiadas");
    refreshDebugInfo();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout completado");
      refreshDebugInfo();
    } catch (error) {
      console.error("Error en logout:", error);
      toast.error("Error en logout");
    }
  };

  const testFlow = (step: string) => {
    toast.info(`Navegando a: ${step}`);
    switch(step) {
      case 'landing':
        router.push('/');
        break;
      case 'login':
        router.push('/login');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Debug de Autenticación</h1>
          <p className="text-muted-foreground">
            Herramienta para debuggear el flujo de autenticación
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshDebugInfo} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Refrescar"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>

      {/* Estado Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Estado:</span>
            <Badge variant={currentUser ? "default" : "secondary"}>
              {currentUser ? "Autenticado" : "No autenticado"}
            </Badge>
          </div>
          
          {currentUser && (
            <div className="space-y-2">
              <div><strong>ID:</strong> {currentUser.id}</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
              <div><strong>Nombre:</strong> {currentUser.user_metadata?.name || "N/A"}</div>
              <div><strong>Rol:</strong> {currentUser.user_metadata?.role || "N/A"}</div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Sesión Demo Válida:</span>
            <Badge variant={hasDemoSession() ? "default" : "secondary"}>
              {hasDemoSession() ? "Sí" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información de Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Información Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">LocalStorage</h4>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div><strong>demo_user:</strong> {debugInfo.localStorage.demo_user ? "✓" : "✗"}</div>
                  <div><strong>demo_session:</strong> {debugInfo.localStorage.demo_session ? "✓" : "✗"}</div>
                  {debugInfo.localStorage.demo_session && debugInfo.localStorage.demo_session.expires_at && (
                    <div className="mt-2">
                      <strong>Expira:</strong> {new Date(debugInfo.localStorage.demo_session.expires_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cookies</h4>
                <div className="bg-muted p-3 rounded-md text-sm">
                  {debugInfo.cookies || "No hay cookies"}
                </div>
              </div>
            </div>
          ) : (
            <div>Cargando información de debug...</div>
          )}
        </CardContent>
      </Card>

      {/* Controles de Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Test de Flujo Completo</h4>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => testFlow('landing')}>
                1. Landing
              </Button>
              <Button variant="outline" onClick={() => testFlow('login')}>
                2. Login
              </Button>
              <Button variant="outline" onClick={() => testFlow('dashboard')}>
                3. Dashboard
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Credenciales Demo</h4>
            <div className="bg-muted p-3 rounded-md text-sm space-y-1">
              <div>• admin@catalinalezama.com / demo123</div>
              <div>• equipo@catalinalezama.com / equipo123</div>
              <div>• demo@demo.com / demo123</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Acciones</h4>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleCleanSessions}>
                Limpiar Sesiones Demo
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout Completo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Flujo Normal:</strong></div>
          <div>1. Ir a Landing page (botón &quot;1. Landing&quot;)</div>
          <div>2. Hacer clic en &quot;Acceso Equipo&quot;</div>
          <div>3. Usar credenciales demo para login</div>
          <div>4. Verificar redirección al dashboard</div>
          <div>5. Hacer logout desde el header</div>
          <div>6. Verificar redirección al landing</div>
          
          <div className="mt-4"><strong>Problemas a Verificar:</strong></div>
          <div>• /login debe ser accesible sin redirecciones forzadas</div>
          <div>• Logout debe limpiar completamente la sesión</div>
          <div>• No debe haber sesiones &quot;fantasma&quot; activas</div>
        </CardContent>
      </Card>
    </div>
  );
}
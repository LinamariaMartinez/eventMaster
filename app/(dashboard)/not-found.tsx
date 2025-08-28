import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Home } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";

export default function DashboardNotFound() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 p-8 max-w-lg">
          {/* 404 Error */}
          <div className="space-y-4">
            <div className="text-6xl font-bold text-burgundy-light">404</div>
            <h2 className="text-2xl font-playfair font-semibold text-text-primary">
              Página no encontrada
            </h2>
            <p className="text-text-secondary leading-relaxed">
              La página que buscas en el dashboard no existe. Puede que la URL sea incorrecta 
              o que la página haya sido movida.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full luxury-gradient hover:burgundy-gradient">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ir al Dashboard
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                <Link href="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver Eventos
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="flex-1 border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                <Link href="/guests">
                  <Search className="mr-2 h-4 w-4" />
                  Ver Invitados
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="pt-6 border-t border-cream-dark/20">
            <p className="text-sm text-text-muted mb-3">Navegación rápida:</p>
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/events" className="text-burgundy hover:text-burgundy-dark">
                Eventos
              </Link>
              <Link href="/guests" className="text-burgundy hover:text-burgundy-dark">
                Invitados
              </Link>
              <Link href="/analytics" className="text-burgundy hover:text-burgundy-dark">
                Analytics
              </Link>
              <Link href="/invitations" className="text-burgundy hover:text-burgundy-dark">
                Invitaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-light to-beige-soft">
      <div className="text-center space-y-8 p-8 max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-burgundy mb-2">
            Catalina Lezama ED
          </h1>
          <p className="text-burgundy-dark text-sm">
            Eventos que Nadie Olvida
          </p>
        </div>

        {/* 404 Error */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-burgundy-light">404</div>
          <h2 className="text-2xl font-playfair font-semibold text-gray-warm">
            Página no encontrada
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full luxury-gradient hover:burgundy-gradient">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-6 border-t border-beige-soft text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contacta a nuestro equipo</p>
          <Link href="/#contacto" className="text-burgundy hover:text-burgundy-dark font-medium">
            Ir a Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/politica-privacidad" className="hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/gestion-datos" className="hover:text-primary transition-colors">
                Gestión de Datos
              </Link>
            </nav>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
import { DataManagement } from "@/components/legal/data-management";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Datos Personales | Catalina Lezama Eventos",
  description: "Ejerce tus derechos sobre el tratamiento de datos personales conforme a la Ley 1581 de 2012",
};

export default function GestionDatosPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <DataManagement />
      </div>
    </div>
  );
}
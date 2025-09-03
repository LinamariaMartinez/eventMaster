import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Catalina Lezama Eventos",
  description: "Política de Tratamiento de Datos Personales conforme a la Ley 1581 de 2012",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <PrivacyPolicy />
      </div>
    </div>
  );
}
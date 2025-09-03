"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrivacyPolicy() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Política de Tratamiento de Datos Personales
        </CardTitle>
        <CardDescription className="text-center">
          De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full pr-4">
          <div className="space-y-6 text-sm">
            
            <section>
              <h3 className="font-semibold text-lg mb-2">1. IDENTIFICACIÓN DEL RESPONSABLE</h3>
              <p className="mb-2">
                <strong>Catalina Lezama Eventos</strong> identificada con NIT [NÚMERO], 
                con domicilio en Colombia, en calidad de Responsable del Tratamiento de datos personales, 
                informa sobre el tratamiento que dará a sus datos personales.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">2. DATOS PERSONALES QUE RECOLECTAMOS</h3>
              <p className="mb-2">Recolectamos los siguientes tipos de datos personales:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Datos de identificación: Nombre completo, documento de identidad</li>
                <li>Datos de contacto: Correo electrónico, número telefónico, dirección</li>
                <li>Datos de eventos: Preferencias alimentarias, acompañantes, mensajes adicionales</li>
                <li>Datos técnicos: Dirección IP, cookies, información del navegador</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">3. FINALIDADES DEL TRATAMIENTO</h3>
              <p className="mb-2">Sus datos personales serán utilizados para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestión y organización de eventos sociales y empresariales</li>
                <li>Envío de invitaciones y confirmaciones de asistencia</li>
                <li>Comunicación relacionada con los eventos</li>
                <li>Mejoramiento de nuestros servicios</li>
                <li>Cumplimiento de obligaciones legales y contractuales</li>
                <li>Realización de estadísticas y análisis de nuestros servicios</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">4. LEGITIMACIÓN DEL TRATAMIENTO</h3>
              <p className="mb-2">
                El tratamiento de sus datos se fundamenta en su consentimiento libre, 
                previo, expreso e informado, así como en la ejecución de la relación contractual.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">5. DERECHOS DEL TITULAR</h3>
              <p className="mb-2">Como titular de datos personales, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada</li>
                <li>Ser informado sobre el uso dado a sus datos</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
                <li>Revocar la autorización o solicitar la supresión del dato</li>
                <li>Acceder de forma gratuita a sus datos personales</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">6. PROCEDIMIENTO PARA EJERCER DERECHOS</h3>
              <p className="mb-2">
                Para ejercer sus derechos puede contactarnos a través de:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Correo electrónico: privacidad@catalinalezamaeventos.com</li>
                <li>Dirección física: [DIRECCIÓN COMPLETA]</li>
                <li>Teléfono: [NÚMERO DE TELÉFONO]</li>
              </ul>
              <p className="mt-2">
                Las consultas serán atendidas en un término máximo de diez (10) días hábiles 
                y los reclamos en quince (15) días hábiles.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">7. TRANSFERENCIAS Y TRANSMISIONES</h3>
              <p className="mb-2">
                Sus datos pueden ser compartidos con terceros únicamente cuando:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sea necesario para la prestación del servicio</li>
                <li>Exista una obligación legal</li>
                <li>Haya autorización expresa del titular</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">8. SEGURIDAD DE LA INFORMACIÓN</h3>
              <p>
                Implementamos medidas técnicas, humanas y administrativas para proteger 
                sus datos personales contra pérdida, alteración, acceso no autorizado o 
                cualquier otro uso no permitido.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2">9. VIGENCIA Y MODIFICACIONES</h3>
              <p>
                Esta política rige desde su publicación y puede ser modificada. 
                Las modificaciones se informarán oportunamente a los titulares.
              </p>
            </section>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-center font-medium">
                Fecha de última actualización: {new Date().toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
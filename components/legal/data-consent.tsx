"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PrivacyPolicy } from "./privacy-policy";
import { Shield, Eye, UserX, Download } from "lucide-react";

interface DataConsentProps {
  onConsentChange: (consents: ConsentState) => void;
  required?: boolean;
  className?: string;
}

export interface ConsentState {
  dataProcessing: boolean;
  communications: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function DataConsent({ onConsentChange, required = true, className = "" }: DataConsentProps) {
  const [consents, setConsents] = useState<ConsentState>({
    dataProcessing: false,
    communications: false,
    analytics: false,
    marketing: false,
  });

  const handleConsentChange = (type: keyof ConsentState, checked: boolean) => {
    const newConsents = { ...consents, [type]: checked };
    setConsents(newConsents);
    onConsentChange(newConsents);
  };

  const isValidForSubmission = required ? consents.dataProcessing : true;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Consentimiento para Tratamiento de Datos Personales
        </CardTitle>
        <CardDescription>
          De conformidad con la Ley 1581 de 2012 de Protección de Datos Personales
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
          <p className="text-sm text-muted-foreground">
            Sus datos personales serán tratados de conformidad con la normatividad colombiana vigente. 
            Por favor, lea cuidadosamente y otorgue su consentimiento para las siguientes finalidades:
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <Checkbox 
              id="dataProcessing"
              checked={consents.dataProcessing}
              onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <label htmlFor="dataProcessing" className="text-sm font-medium leading-none cursor-pointer">
                Tratamiento básico de datos personales {required && <span className="text-destructive">*</span>}
              </label>
              <p className="text-xs text-muted-foreground">
                Autorizo el tratamiento de mis datos personales para la gestión de eventos, 
                envío de invitaciones, confirmaciones de asistencia y comunicaciones relacionadas 
                con los servicios contratados.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <Checkbox 
              id="communications"
              checked={consents.communications}
              onCheckedChange={(checked) => handleConsentChange('communications', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <label htmlFor="communications" className="text-sm font-medium leading-none cursor-pointer">
                Comunicaciones del servicio
              </label>
              <p className="text-xs text-muted-foreground">
                Acepto recibir comunicaciones relacionadas con mis eventos, recordatorios, 
                actualizaciones de servicios y notificaciones importantes.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <Checkbox 
              id="analytics"
              checked={consents.analytics}
              onCheckedChange={(checked) => handleConsentChange('analytics', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <label htmlFor="analytics" className="text-sm font-medium leading-none cursor-pointer">
                Análisis y mejoramiento
              </label>
              <p className="text-xs text-muted-foreground">
                Autorizo el uso de mis datos para análisis estadísticos, mejoramiento de servicios 
                y personalización de la experiencia (datos anonimizados).
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
            <Checkbox 
              id="marketing"
              checked={consents.marketing}
              onCheckedChange={(checked) => handleConsentChange('marketing', checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1 space-y-1">
              <label htmlFor="marketing" className="text-sm font-medium leading-none cursor-pointer">
                Comunicaciones comerciales
              </label>
              <p className="text-xs text-muted-foreground">
                Acepto recibir información sobre promociones, nuevos servicios, ofertas especiales 
                y contenido de interés relacionado con organización de eventos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Política de Privacidad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Política de Tratamiento de Datos Personales</DialogTitle>
                  <DialogDescription>
                    Información completa sobre el tratamiento de sus datos personales
                  </DialogDescription>
                </DialogHeader>
                <PrivacyPolicy />
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Descargar Política
            </Button>

            <Button variant="outline" size="sm" className="text-xs">
              <UserX className="w-3 h-3 mr-1" />
              Ejercer Derechos
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Sus derechos:</strong> Puede conocer, actualizar, rectificar o suprimir sus datos, 
              así como revocar la autorización otorgada contactando a privacidad@catalinalezamaeventos.com
            </p>
            <p>
              <strong>Responsable:</strong> Catalina Lezama Eventos - Colombia
            </p>
            <p>
              Al marcar las casillas anteriores, manifiesto que he leído, entendido y acepto 
              la Política de Tratamiento de Datos Personales y otorgo mi consentimiento libre, 
              previo, expreso e informado para el tratamiento de mis datos personales conforme 
              a las finalidades seleccionadas.
            </p>
          </div>
        </div>

        {required && !isValidForSubmission && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              Debe aceptar el tratamiento básico de datos personales para continuar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Download, Trash2, Edit, Eye, Shield } from "lucide-react";

export function DataManagement() {
  const [requestType, setRequestType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestTypes = [
    { value: "access", label: "Acceso a mis datos", description: "Solicitar una copia de mis datos personales" },
    { value: "rectification", label: "Rectificación", description: "Corregir datos incorrectos o incompletos" },
    { value: "update", label: "Actualización", description: "Actualizar mis datos personales" },
    { value: "deletion", label: "Supresión", description: "Eliminar mis datos del sistema" },
    { value: "portability", label: "Portabilidad", description: "Transferir mis datos a otro responsable" },
    { value: "objection", label: "Oposición", description: "Oponerme al tratamiento de mis datos" },
    { value: "revocation", label: "Revocación", description: "Revocar el consentimiento otorgado" },
    { value: "complaint", label: "Queja o reclamo", description: "Presentar una queja sobre el tratamiento" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestType || !email || !identificationNumber) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to handle data rights request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const requestTypeLabel = requestTypes.find(rt => rt.value === requestType)?.label || requestType;
      
      toast.success(`Solicitud de ${requestTypeLabel} enviada exitosamente. 
      Será procesada dentro de los términos legales establecidos (máximo 15 días hábiles).`);
      
      // Reset form
      setRequestType("");
      setEmail("");
      setIdentificationNumber("");
      setDescription("");
      
    } catch (error) {
      toast.error("Error al enviar la solicitud. Inténtelo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRequestType = requestTypes.find(rt => rt.value === requestType);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Gestión de Datos Personales
        </CardTitle>
        <CardDescription>
          Ejercite sus derechos sobre el tratamiento de datos personales conforme a la Ley 1581 de 2012
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
            <div className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Sus Derechos</h3>
              <p className="text-sm text-muted-foreground">Protegidos por ley</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Transparencia</h3>
              <p className="text-sm text-muted-foreground">Total transparencia</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestType">
              Tipo de solicitud <span className="text-destructive">*</span>
            </Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger className="select-trigger-accessible">
                <SelectValue placeholder="Seleccione el tipo de solicitud" />
              </SelectTrigger>
              <SelectContent className="select-content-accessible">
                {requestTypes.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value}
                    className="select-item-accessible"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRequestType && (
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                {selectedRequestType.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="su.correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification">
                Documento de identidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="identification"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                placeholder="Número de documento"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción detallada</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa su solicitud con el mayor detalle posible..."
              rows={4}
            />
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Las solicitudes serán procesadas dentro de los términos legales establecidos</li>
              <li>• Consultas: máximo 10 días hábiles</li>
              <li>• Reclamos: máximo 15 días hábiles</li>
              <li>• Se requiere verificación de identidad para procesar la solicitud</li>
              <li>• Recibirá una respuesta en el correo electrónico proporcionado</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !requestType || !email || !identificationNumber}
          >
            {isLoading ? "Enviando solicitud..." : "Enviar solicitud"}
          </Button>
        </form>

        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-2">Contacto adicional:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>📧 privacidad@catalinalezamaeventos.com</p>
            <p>📞 +57 [TELÉFONO]</p>
            <p>📍 [DIRECCIÓN COMPLETA], Colombia</p>
            <p className="mt-2">
              También puede presentar quejas ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
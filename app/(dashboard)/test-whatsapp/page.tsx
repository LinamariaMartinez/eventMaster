"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  WhatsAppService, 
  WhatsAppMessage, 
  testWhatsAppIntegration,
  defaultWhatsAppService 
} from "@/lib/whatsapp-service";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, TestTube, CheckCircle, ExternalLink } from "lucide-react";

export default function WhatsAppTestPage() {
  const { toast } = useToast();
  const [testMessage, setTestMessage] = useState<WhatsAppMessage>({
    eventTitle: "Boda de María y Carlos",
    eventDate: "15 de Marzo, 2025",
    eventTime: "6:00 PM",
    venue: "Hotel Casa Colonial, Bogotá",
    hostName: "Catalina Lezama",
    guestName: "Ana García",
  });

  const [phoneNumber, setPhoneNumber] = useState("573001234567");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [testResults, setTestResults] = useState<{
    success: boolean;
    analytics: {
      timestamp: string;
      eventTitle: string;
      messageLength: number;
      hasGuestName: boolean;
      hasHostName: boolean;
    };
    timestamp: string;
  } | null>(null);

  const handleTestMessage = () => {
    const service = new WhatsAppService({ businessNumber: phoneNumber });
    const url = service.generateWhatsAppUrl(testMessage);
    setGeneratedUrl(url);
    
    toast({
      title: "URL Generada",
      description: "Se ha generado la URL de WhatsApp con el mensaje personalizado.",
    });
  };

  const handleSendTest = async () => {
    const service = new WhatsAppService({ businessNumber: phoneNumber });
    const success = await service.testConnection(testMessage);
    
    if (success) {
      toast({
        title: "¡Test Exitoso!",
        description: "Se ha abierto WhatsApp con el mensaje de prueba.",
      });
    } else {
      toast({
        title: "Error en el Test",
        description: "No se pudo abrir WhatsApp. Verifica la configuración.",
        variant: "destructive",
      });
    }
  };

  const handleFullTest = async () => {
    const result = await testWhatsAppIntegration();
    const analytics = defaultWhatsAppService.generateAnalytics(testMessage);
    
    setTestResults({
      success: result,
      analytics,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: result ? "Test Completo Exitoso" : "Test Falló",
      description: result ? "Todas las funciones de WhatsApp funcionan correctamente." : "Algunas funciones fallaron.",
      variant: result ? "default" : "destructive",
    });
  };

  const handleInputChange = (field: keyof WhatsAppMessage, value: string) => {
    setTestMessage(prev => ({ ...prev, [field]: value }));
  };

  const isValidPhone = WhatsAppService.validatePhoneNumber(phoneNumber);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-green-600" />
            Test WhatsApp API Integration
          </h1>
          <p className="text-muted-foreground mt-2">
            Prueba y configura la integración con WhatsApp Business API
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Configuración de Prueba
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Número de WhatsApp Business</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="573001234567"
                  />
                  <Badge variant={isValidPhone ? "default" : "destructive"}>
                    {isValidPhone ? "Válido" : "Inválido"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTitle">Título del Evento</Label>
                <Input
                  id="eventTitle"
                  value={testMessage.eventTitle}
                  onChange={(e) => handleInputChange("eventTitle", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Fecha</Label>
                  <Input
                    id="eventDate"
                    value={testMessage.eventDate}
                    onChange={(e) => handleInputChange("eventDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Hora</Label>
                  <Input
                    id="eventTime"
                    value={testMessage.eventTime}
                    onChange={(e) => handleInputChange("eventTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Lugar</Label>
                <Input
                  id="venue"
                  value={testMessage.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hostName">Anfitrión (opcional)</Label>
                  <Input
                    id="hostName"
                    value={testMessage.hostName || ""}
                    onChange={(e) => handleInputChange("hostName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestName">Nombre del Invitado (opcional)</Label>
                  <Input
                    id="guestName"
                    value={testMessage.guestName || ""}
                    onChange={(e) => handleInputChange("guestName", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones de Prueba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleTestMessage} className="w-full" variant="outline">
                🔗 Generar URL de WhatsApp
              </Button>

              <Button 
                onClick={handleSendTest} 
                className="w-full" 
                disabled={!isValidPhone}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensaje de Prueba
              </Button>

              <Button onClick={handleFullTest} className="w-full" variant="secondary">
                <TestTube className="h-4 w-4 mr-2" />
                Test Completo de Integración
              </Button>

              {generatedUrl && (
                <div className="space-y-2">
                  <Label>URL Generada:</Label>
                  <div className="flex items-center gap-2">
                    <Textarea
                      value={generatedUrl}
                      readOnly
                      className="text-xs h-20"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(generatedUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-red-600" />
                )}
                Resultados del Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Estado:</h4>
                  <Badge variant={testResults.success ? "default" : "destructive"}>
                    {testResults.success ? "✅ Éxitoso" : "❌ Fallido"}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timestamp:</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(testResults.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Analytics:</h4>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                  {JSON.stringify(testResults.analytics, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Guía de Integración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <h4 className="font-medium">Pasos para configurar WhatsApp Business API:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Obtén un número de WhatsApp Business</li>
                <li>Configura el número en la aplicación</li>
                <li>Prueba la generación de URLs</li>
                <li>Verifica que los mensajes se abran correctamente</li>
                <li>Implementa analytics para tracking</li>
              </ol>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Esta integración utiliza WhatsApp Web/App del usuario. 
                Para funcionalidad avanzada, considera usar la API oficial de WhatsApp Business.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
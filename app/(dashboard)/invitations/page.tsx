"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Download, Send, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface InvitationTemplate {
  id: string;
  name: string;
  thumbnail: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
  };
}

interface SavedInvitation {
  id: string;
  name: string;
  template: string;
  event: string;
  status: 'draft' | 'sent';
  recipientCount: number;
  createdAt: string;
}

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState("manage");
  
  const templates: InvitationTemplate[] = [
    { id: "elegant", name: "Elegante", thumbnail: "/elegant-classic-invitation-burgundy-cream.png", colors: { bg: "#1a1b23", text: "#f5f5f5", accent: "#d4af37" } },
    { id: "romantic", name: "Romántico", thumbnail: "/romantic-vintage-invitation-floral-design.png", colors: { bg: "#ffffff", text: "#2d3748", accent: "#e53e3e" } },
    { id: "modern", name: "Moderno", thumbnail: "/modern-minimalist-invitation-clean-design.png", colors: { bg: "#f7fafc", text: "#2d3748", accent: "#3182ce" } },
    { id: "festive", name: "Festivo", thumbnail: "/festive-colorful-invitation-celebration.png", colors: { bg: "#667eea", text: "#ffffff", accent: "#f093fb" } }
  ];

  const savedInvitations: SavedInvitation[] = [
    {
      id: "1",
      name: "Invitación Boda María & Carlos",
      template: "Romántico", 
      event: "Boda María & Carlos",
      status: "sent",
      recipientCount: 150,
      createdAt: "2025-01-15"
    },
    {
      id: "2", 
      name: "Invitación Cena de Gala 2025",
      template: "Elegante",
      event: "Cena de Gala 2025", 
      status: "draft",
      recipientCount: 80,
      createdAt: "2025-01-10"
    },
    {
      id: "3",
      name: "XV Años Sofía",
      template: "Festivo",
      event: "Cumpleaños XV Sofía",
      status: "sent", 
      recipientCount: 120,
      createdAt: "2025-01-08"
    }
  ];


  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Invitaciones</h2>
            <p className="text-muted-foreground">Administra las invitaciones de tus eventos</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage">
              <Edit className="h-4 w-4 mr-2" />
              Gestionar
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Eye className="h-4 w-4 mr-2" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Send className="h-4 w-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invitaciones Guardadas</CardTitle>
                <CardDescription>
                  Administra tus invitaciones creadas y envíalas a tus invitados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{invitation.name}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="mr-4">Evento: {invitation.event}</span>
                          <span className="mr-4">Plantilla: {invitation.template}</span>
                          <span>{invitation.recipientCount} destinatarios</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Creado: {new Date(invitation.createdAt).toLocaleDateString('es-CO')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          invitation.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invitation.status === 'sent' ? 'Enviada' : 'Borrador'}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invitation.status === 'draft' && (
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Enviar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas Disponibles</CardTitle>
                <CardDescription>
                  Selecciona una plantilla para crear una nueva invitación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                          <Image
                            src={template.thumbnail}
                            alt={template.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-center">{template.name}</h3>
                        <Button className="w-full mt-3" size="sm">
                          Usar Plantilla
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Invitaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">
                    +3 desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Invitaciones Enviadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    80% del total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Tasa de Apertura</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">
                    Promedio de visualización
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Plantillas</CardTitle>
                <CardDescription>
                  Popularidad de plantillas utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <span className="font-medium">{template.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 10) + 1} usos
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

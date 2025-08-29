"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Download, 
  Send, 
  Plus, 
  Trash2, 
  Copy,
  ExternalLink,
  BarChart3,
  Crown,
  Sparkles 
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { 
  invitationStorage, 
  invitationTemplateStorage, 
  eventStorage,
  type Invitation 
} from "@/lib/storage";

export default function InvitationsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manage");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const templates = invitationTemplateStorage.getAll();
  const events = eventStorage.getAll();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = () => {
    try {
      const savedInvitations = invitationStorage.getAll();
      setInvitations(savedInvitations);
    } catch (error) {
      console.error("Error loading invitations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las invitaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async (invitation: Invitation) => {
    const fullUrl = `${window.location.origin}${invitation.publicUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL copiada",
      description: "El enlace de la invitación ha sido copiado al portapapeles",
    });
  };

  const handleDeleteInvitation = (invitationId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta invitación?")) {
      try {
        invitationStorage.remove(invitationId);
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        toast({
          title: "Invitación eliminada",
          description: "La invitación ha sido eliminada correctamente",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la invitación",
          variant: "destructive",
        });
      }
    }
  };

  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.title || "Evento eliminado";
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || "Plantilla eliminada";
  };

  const getStatusBadge = (invitation: Invitation) => {
    switch (invitation.status) {
      case "published":
        return <Badge className="bg-green-500">Publicada</Badge>;
      case "draft":
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="secondary">{invitation.status}</Badge>;
    }
  };

  const getTypeBadge = (type: "simple" | "premium") => {
    return type === "premium" ? (
      <Badge className="bg-yellow-500">
        <Crown className="h-3 w-3 mr-1" />
        Premium
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Sparkles className="h-3 w-3 mr-1" />
        Simple
      </Badge>
    );
  };

  const totalInvitations = invitations.length;
  const publishedInvitations = invitations.filter(inv => inv.status === "published").length;
  const totalViews = invitations.reduce((sum, inv) => sum + inv.openedCount, 0);
  const totalResponses = invitations.reduce((sum, inv) => sum + inv.respondedCount, 0);
  const averageResponseRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Invitaciones</h2>
            <p className="text-muted-foreground">Crea y administra las invitaciones de tus eventos</p>
          </div>
          <Button asChild>
            <Link href="/invitations/editor">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Invitación
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage">
              <Edit className="h-4 w-4 mr-2" />
              Mis Invitaciones
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Eye className="h-4 w-4 mr-2" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invitaciones Creadas</CardTitle>
                <CardDescription>
                  Administra tus invitaciones y compártelas con tus invitados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 border rounded-lg">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium truncate">{invitation.title}</h3>
                            {getTypeBadge(invitation.type)}
                            {getStatusBadge(invitation)}
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-4">
                              <span>Evento: {getEventName(invitation.eventId)}</span>
                              <span>Plantilla: {getTemplateName(invitation.templateId)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span>👁️ {invitation.openedCount} visualizaciones</span>
                              <span>✅ {invitation.respondedCount} respuestas</span>
                              <span>📅 {new Date(invitation.createdAt).toLocaleDateString('es-CO')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {invitation.status === "published" && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleCopyUrl(invitation)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={invitation.publicUrl} target="_blank">
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/invitations/editor?id=${invitation.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteInvitation(invitation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h4 className="font-medium mb-2">No tienes invitaciones aún</h4>
                      <p className="text-sm mb-4">
                        Crea tu primera invitación para comenzar
                      </p>
                      <Button asChild>
                        <Link href="/invitations/editor">
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Primera Invitación
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas Disponibles</CardTitle>
                <CardDescription>
                  Explora nuestras plantillas organizadas por categorías
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="wedding" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="wedding">Bodas</TabsTrigger>
                    <TabsTrigger value="corporate">Corporativo</TabsTrigger>
                    <TabsTrigger value="birthday">Cumpleaños</TabsTrigger>
                  </TabsList>
                  
                  {["wedding", "corporate", "birthday"].map((category) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates
                          .filter(template => template.category === category)
                          .map((template) => (
                            <Card key={template.id} className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-lg">
                                  <div
                                    className="w-full h-full flex items-center justify-center text-center p-4"
                                    style={{
                                      backgroundColor: template.styles.backgroundType === "gradient" 
                                        ? undefined 
                                        : template.styles.backgroundColor,
                                      background: template.styles.backgroundType === "gradient"
                                        ? `linear-gradient(135deg, ${template.styles.gradientFrom}, ${template.styles.gradientTo})`
                                        : undefined,
                                      color: template.styles.textColor,
                                      fontFamily: template.styles.fontFamily === "serif" 
                                        ? "serif" 
                                        : template.styles.fontFamily === "script" 
                                        ? "cursive" 
                                        : "sans-serif",
                                      borderRadius: `${template.layout.borderRadius}px`,
                                    }}
                                  >
                                    <div className="space-y-2">
                                      <div 
                                        className="w-12 h-1 mx-auto rounded"
                                        style={{ backgroundColor: template.styles.accentColor }}
                                      />
                                      <h4 className="font-bold text-sm">Vista Previa</h4>
                                      <p className="text-xs opacity-90">{template.name}</p>
                                    </div>
                                  </div>
                                  {template.type === "premium" && (
                                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                                      <Crown className="h-3 w-3 mr-1" />
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{template.name}</h4>
                                    {getTypeBadge(template.type)}
                                  </div>
                                  
                                  <Button size="sm" className="w-full" asChild>
                                    <Link href={`/invitations/editor?template=${template.id}`}>
                                      Usar Plantilla
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Invitaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInvitations}</div>
                  <p className="text-xs text-muted-foreground">
                    {publishedInvitations} publicadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de vistas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Respuestas RSVP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalResponses}</div>
                  <p className="text-xs text-muted-foreground">
                    Confirmaciones recibidas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageResponseRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Promedio de respuesta
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Invitación</CardTitle>
                <CardDescription>
                  Estadísticas detalladas de tus invitaciones publicadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invitations.filter(inv => inv.status === "published").length > 0 ? (
                  <div className="space-y-4">
                    {invitations
                      .filter(inv => inv.status === "published")
                      .map((invitation) => {
                        const responseRate = invitation.openedCount > 0 
                          ? Math.round((invitation.respondedCount / invitation.openedCount) * 100) 
                          : 0;
                        
                        return (
                          <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{invitation.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {getEventName(invitation.eventId)}
                              </p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-center">
                                <div className="font-medium">{invitation.openedCount}</div>
                                <div className="text-muted-foreground">Vistas</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{invitation.respondedCount}</div>
                                <div className="text-muted-foreground">Respuestas</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{responseRate}%</div>
                                <div className="text-muted-foreground">Tasa</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="font-medium mb-2">No hay estadísticas disponibles</h4>
                    <p className="text-sm">
                      Publica tus invitaciones para ver estadísticas detalladas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
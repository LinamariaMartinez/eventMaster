"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Building2, Gift, Check, Crown } from "lucide-react";
import { InvitationTemplate } from "@/lib/storage";
import Image from "next/image";

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (templateId: string) => void;
  templates: InvitationTemplate[];
  selectedType: "simple" | "premium";
}

export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  templates,
  selectedType,
}: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<"wedding" | "corporate" | "birthday">("wedding");
  
  const filteredTemplates = templates.filter(
    (template) => template.category === activeCategory && template.type === selectedType
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wedding":
        return <Heart className="h-4 w-4" />;
      case "corporate":
        return <Building2 className="h-4 w-4" />;
      case "birthday":
        return <Gift className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "wedding":
        return "Bodas";
      case "corporate":
        return "Corporativo";
      case "birthday":
        return "Cumpleaños";
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Plantillas {selectedType === "premium" ? "Premium" : "Simple"}
        </h3>
        <p className="text-muted-foreground">
          Selecciona una plantilla para tu evento
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wedding" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Bodas
          </TabsTrigger>
          <TabsTrigger value="corporate" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Corporativo
          </TabsTrigger>
          <TabsTrigger value="birthday" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Cumpleaños
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-lg bg-muted">
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
                        <h4 className="font-bold text-sm">Título del Evento</h4>
                        <p className="text-xs opacity-90">Vista previa de la plantilla</p>
                        <div className="text-xs space-y-1 mt-3">
                          <div>📅 Fecha del evento</div>
                          <div>📍 Ubicación</div>
                        </div>
                      </div>
                    </div>
                    {template.type === "premium" && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getCategoryIcon(template.category)}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full"
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                    >
                      {selectedTemplate === template.id ? "Seleccionada" : "Usar Plantilla"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <div className="mb-4">
                  {getCategoryIcon(activeCategory)}
                </div>
                <h4 className="font-medium mb-2">No hay plantillas disponibles</h4>
                <p className="text-sm">
                  No se encontraron plantillas {selectedType} para la categoría {getCategoryName(activeCategory)}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
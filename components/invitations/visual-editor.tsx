"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Palette, Type, Image, Layout, Upload } from "lucide-react";
import { Invitation } from "@/lib/storage";

interface VisualEditorProps {
  invitation: Partial<Invitation>;
  onUpdate: (updates: Partial<Invitation>) => void;
  isPremium: boolean;
}

export function VisualEditor({ invitation, onUpdate, isPremium }: VisualEditorProps) {
  const handleStyleUpdate = (key: string, value: string | boolean | undefined) => {
    const defaultStyles = {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      accentColor: "#3b82f6",
      fontFamily: "sans-serif",
      fontSize: "16px",
      backgroundType: "solid" as const,
    };
    
    onUpdate({
      customStyles: {
        ...defaultStyles,
        ...invitation.customStyles,
        [key]: value,
      },
    });
  };

  const handleLayoutUpdate = (key: string, value: number) => {
    const defaultLayout = {
      headerHeight: 120,
      contentPadding: 32,
      borderRadius: 12,
      shadowLevel: 2,
    };
    
    onUpdate({
      layout: {
        ...defaultLayout,
        ...invitation.layout,
        [key]: value,
      },
    });
  };

  const fontFamilies = [
    { id: "sans-serif", name: "Sans Serif (Moderno)", preview: "Arial, sans-serif" },
    { id: "serif", name: "Serif (Clásico)", preview: "Georgia, serif" },
    { id: "script", name: "Script (Elegante)", preview: "cursive" },
    { id: "monospace", name: "Monospace (Técnico)", preview: "monospace" },
  ];

  const fontSizes = [
    { id: "14px", name: "Pequeño" },
    { id: "16px", name: "Normal" },
    { id: "18px", name: "Grande" },
    { id: "20px", name: "Muy Grande" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleStyleUpdate("backgroundImage", result);
        handleStyleUpdate("backgroundType", "image");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Editor Visual
        </CardTitle>
        <CardDescription>
          Personaliza la apariencia de tu invitación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              Colores
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-1">
              <Type className="h-4 w-4" />
              Texto
            </TabsTrigger>
            <TabsTrigger value="background" className="flex items-center gap-1" disabled={!isPremium}>
              <Image className="h-4 w-4" aria-hidden="true" />
              Fondo
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-1" disabled={!isPremium}>
              <Layout className="h-4 w-4" />
              Diseño
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={invitation.customStyles?.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={invitation.customStyles?.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Color del texto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={invitation.customStyles?.textColor || "#000000"}
                    onChange={(e) => handleStyleUpdate("textColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={invitation.customStyles?.textColor || "#000000"}
                    onChange={(e) => handleStyleUpdate("textColor", e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Color de acento</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={invitation.customStyles?.accentColor || "#3b82f6"}
                    onChange={(e) => handleStyleUpdate("accentColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={invitation.customStyles?.accentColor || "#3b82f6"}
                    onChange={(e) => handleStyleUpdate("accentColor", e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Familia de fuente</Label>
                <Select
                  value={invitation.customStyles?.fontFamily || "sans-serif"}
                  onValueChange={(value) => handleStyleUpdate("fontFamily", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.id} value={font.id}>
                        <span style={{ fontFamily: font.preview }}>
                          {font.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Tamaño de fuente</Label>
                <Select
                  value={invitation.customStyles?.fontSize || "16px"}
                  onValueChange={(value) => handleStyleUpdate("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name} ({size.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            {isPremium ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gradient-mode"
                    checked={invitation.customStyles?.backgroundType === "gradient"}
                    onCheckedChange={(checked) =>
                      handleStyleUpdate("backgroundType", checked ? "gradient" : "solid")
                    }
                  />
                  <Label htmlFor="gradient-mode">Usar gradiente</Label>
                </div>

                {invitation.customStyles?.backgroundType === "gradient" && (
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradientFrom">Color inicial del gradiente</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="gradientFrom"
                          type="color"
                          value={invitation.customStyles?.gradientFrom || "#ffffff"}
                          onChange={(e) => handleStyleUpdate("gradientFrom", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={invitation.customStyles?.gradientFrom || "#ffffff"}
                          onChange={(e) => handleStyleUpdate("gradientFrom", e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gradientTo">Color final del gradiente</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="gradientTo"
                          type="color"
                          value={invitation.customStyles?.gradientTo || "#f3f4f6"}
                          onChange={(e) => handleStyleUpdate("gradientTo", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={invitation.customStyles?.gradientTo || "#f3f4f6"}
                          onChange={(e) => handleStyleUpdate("gradientTo", e.target.value)}
                          placeholder="#f3f4f6"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="backgroundImage">Imagen de fondo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="backgroundImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {invitation.customStyles?.backgroundImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleStyleUpdate("backgroundImage", undefined);
                        handleStyleUpdate("backgroundType", "solid");
                      }}
                    >
                      Eliminar imagen
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Image className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <h4 className="font-medium mb-2">Función Premium</h4>
                <p className="text-sm">
                  Actualiza a Premium para personalizar fondos con gradientes e imágenes
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            {isPremium ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headerHeight">Altura del encabezado: {invitation.layout?.headerHeight || 120}px</Label>
                  <Slider
                    id="headerHeight"
                    min={80}
                    max={200}
                    step={10}
                    value={[invitation.layout?.headerHeight || 120]}
                    onValueChange={([value]) => handleLayoutUpdate("headerHeight", value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentPadding">Espaciado interno: {invitation.layout?.contentPadding || 32}px</Label>
                  <Slider
                    id="contentPadding"
                    min={16}
                    max={60}
                    step={4}
                    value={[invitation.layout?.contentPadding || 32]}
                    onValueChange={([value]) => handleLayoutUpdate("contentPadding", value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="borderRadius">Bordes redondeados: {invitation.layout?.borderRadius || 12}px</Label>
                  <Slider
                    id="borderRadius"
                    min={0}
                    max={30}
                    step={2}
                    value={[invitation.layout?.borderRadius || 12]}
                    onValueChange={([value]) => handleLayoutUpdate("borderRadius", value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shadowLevel">Intensidad de sombra: {invitation.layout?.shadowLevel || 2}</Label>
                  <Slider
                    id="shadowLevel"
                    min={0}
                    max={5}
                    step={1}
                    value={[invitation.layout?.shadowLevel || 2]}
                    onValueChange={([value]) => handleLayoutUpdate("shadowLevel", value)}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h4 className="font-medium mb-2">Función Premium</h4>
                <p className="text-sm">
                  Actualiza a Premium para personalizar el diseño y espaciado
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { 
  Camera, 
  MapPin, 
  Shirt, 
  Gift, 
  Plus,
  ExternalLink,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Invitation } from "@/lib/storage";

interface PremiumFeaturesEditorProps {
  invitation: Partial<Invitation>;
  onUpdate: (updates: Partial<Invitation>) => void;
}

export function PremiumFeaturesEditor({ invitation, onUpdate }: PremiumFeaturesEditorProps) {
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>(invitation.gallery?.images || []);
  const [imageCaptions, setImageCaptions] = useState<string[]>(invitation.gallery?.captions || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  const updateContent = useCallback((field: string, value: string | number | { lat: number; lng: number }) => {
    onUpdate({
      content: {
        hostName: invitation.content?.hostName || "Anfitrión",
        eventDate: invitation.content?.eventDate || "",
        eventTime: invitation.content?.eventTime || "",
        venue: invitation.content?.venue || "",
        ...invitation.content,
        [field]: value,
      },
    });
  }, [invitation.content, onUpdate]);

  const updateGallery = useCallback(() => {
    onUpdate({
      gallery: {
        images: imageUrls.filter(url => url.trim() !== ""),
        captions: imageCaptions,
      },
    });
  }, [imageUrls, imageCaptions, onUpdate]);

  const addImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL de imagen válida",
        variant: "destructive",
      });
      return;
    }

    const updatedUrls = [...imageUrls, newImageUrl.trim()];
    const updatedCaptions = [...imageCaptions, newImageCaption.trim()];
    
    setImageUrls(updatedUrls);
    setImageCaptions(updatedCaptions);
    setNewImageUrl("");
    setNewImageCaption("");

    // Update invitation
    onUpdate({
      gallery: {
        images: updatedUrls,
        captions: updatedCaptions,
      },
    });

    toast({
      title: "Imagen agregada",
      description: "La imagen ha sido agregada a la galería",
    });
  };

  const removeImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    const updatedCaptions = imageCaptions.filter((_, i) => i !== index);
    
    setImageUrls(updatedUrls);
    setImageCaptions(updatedCaptions);

    onUpdate({
      gallery: {
        images: updatedUrls,
        captions: updatedCaptions,
      },
    });

    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada de la galería",
    });
  };

  const updateImageCaption = (index: number, caption: string) => {
    const updatedCaptions = [...imageCaptions];
    updatedCaptions[index] = caption;
    setImageCaptions(updatedCaptions);
  };

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        updateContent('venueCoordinates', {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });

        toast({
          title: "Ubicación encontrada",
          description: "Las coordenadas han sido actualizadas automáticamente",
        });
      } else {
        toast({
          title: "Ubicación no encontrada",
          description: "No se pudieron encontrar las coordenadas para esta dirección",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Error al buscar la ubicación",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="default" className="px-4 py-2">
          ✨ Características Premium
        </Badge>
      </div>

      {/* Photo Gallery Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Galería de Fotos
          </CardTitle>
          <CardDescription>
            Agrega fotos para crear una galería visual en tu invitación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Images */}
          {imageUrls.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Imágenes actuales:</h4>
              <div className="grid gap-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={url} 
                        alt={imageCaptions[index] || `Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Descripción de la imagen (opcional)"
                        value={imageCaptions[index] || ""}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        onBlur={updateGallery}
                      />
                      <p className="text-xs text-muted-foreground truncate">{url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Image */}
          <div className="space-y-3">
            <h4 className="font-medium">Agregar nueva imagen:</h4>
            <div className="space-y-2">
              <Input
                placeholder="URL de la imagen"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Input
                placeholder="Descripción de la imagen (opcional)"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
              />
              <Button onClick={addImage} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Imagen
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Consejos para las imágenes:</p>
            <ul className="text-xs space-y-1">
              <li>• Usa URLs de imágenes públicas y accesibles</li>
              <li>• Recomendado: formato WebP para mejor optimización</li>
              <li>• Tamaño recomendado: al menos 800x600 píxeles</li>
              <li>• Las primeras 6 imágenes se mostrarán en la galería principal</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Location & Map Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubicación y Mapa
          </CardTitle>
          <CardDescription>
            Configura la ubicación del evento con mapa interactivo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venue">Nombre del lugar</Label>
              <Input
                id="venue"
                value={invitation.content?.venue || ""}
                onChange={(e) => updateContent("venue", e.target.value)}
                placeholder="Ej: Salón de Eventos Los Jardines"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venueAddress">Dirección completa</Label>
              <div className="flex gap-2">
                <Input
                  id="venueAddress"
                  value={invitation.content?.venueAddress || ""}
                  onChange={(e) => updateContent("venueAddress", e.target.value)}
                  placeholder="Calle 123 #45-67, Ciudad"
                />
                <Button
                  variant="outline"
                  onClick={() => geocodeAddress(invitation.content?.venueAddress || "")}
                  disabled={!invitation.content?.venueAddress}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {invitation.content?.venueCoordinates && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Coordenadas: {invitation.content.venueCoordinates.lat.toFixed(6)}, {invitation.content.venueCoordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dress Code Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Código de Vestimenta
          </CardTitle>
          <CardDescription>
            Especifica el código de vestimenta para el evento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dressCode">Código de vestimenta</Label>
            <Input
              id="dressCode"
              value={invitation.content?.dressCode || ""}
              onChange={(e) => updateContent("dressCode", e.target.value)}
              placeholder="Ej: Formal, Casual Elegante, Cocktail"
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Códigos comunes:</p>
            <div className="flex flex-wrap gap-2">
              {["Formal", "Casual Elegante", "Cocktail", "Semi-formal", "Playa"].map((code) => (
                <Button
                  key={code}
                  variant="outline"
                  size="sm"
                  onClick={() => updateContent("dressCode", code)}
                >
                  {code}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Information Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Información sobre Regalos
          </CardTitle>
          <CardDescription>
            Configura información sobre regalos y lista de regalos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="giftInfo">Información sobre regalos</Label>
            <Textarea
              id="giftInfo"
              value={invitation.content?.giftInfo || ""}
              onChange={(e) => updateContent("giftInfo", e.target.value)}
              placeholder="Ej: Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="giftRegistryUrl">URL de lista de regalos (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="giftRegistryUrl"
                value={invitation.content?.giftRegistryUrl || ""}
                onChange={(e) => updateContent("giftRegistryUrl", e.target.value)}
                placeholder="https://..."
              />
              {invitation.content?.giftRegistryUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(invitation.content?.giftRegistryUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
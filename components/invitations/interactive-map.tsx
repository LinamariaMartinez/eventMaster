"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Car, 
  Train, 
  Clock,
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapCoordinates {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  venue: string;
  address?: string;
  coordinates?: MapCoordinates;
  className?: string;
}

// Geocoding function to convert address to coordinates
const geocodeAddress = async (address: string): Promise<MapCoordinates | null> => {
  try {
    // Using OpenStreetMap Nominatim API (free alternative to Google Geocoding)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Generate different map service URLs
const getMapUrls = (coords: MapCoordinates, venue: string) => {
  const { lat, lng } = coords;
  const encodedVenue = encodeURIComponent(venue);
  
  return {
    google: `https://maps.google.com/?q=${lat},${lng}`,
    googleDirections: `https://maps.google.com/maps?daddr=${lat},${lng}`,
    apple: `http://maps.apple.com/?q=${encodedVenue}&ll=${lat},${lng}`,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    openStreet: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`
  };
};

export function InteractiveMap({ venue, address, coordinates, className = "" }: InteractiveMapProps) {
  const { toast } = useToast();
  const [mapCoords, setMapCoords] = useState<MapCoordinates | null>(coordinates || null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Geocode address if coordinates are not provided
  useEffect(() => {
    const loadCoordinates = async () => {
      if (coordinates) {
        setMapCoords(coordinates);
        return;
      }

      if (address) {
        setIsLoading(true);
        setMapError(null);
        
        try {
          const coords = await geocodeAddress(address);
          if (coords) {
            setMapCoords(coords);
          } else {
            setMapError('No se pudo encontrar la ubicación');
          }
        } catch (error) {
          setMapError('Error al cargar la ubicación');
          console.error('Map loading error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCoordinates();
  }, [address, coordinates]);

  const copyAddress = useCallback(async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(true);
        toast({
          title: "Dirección copiada",
          description: "La dirección ha sido copiada al portapapeles",
        });
        setTimeout(() => setCopiedAddress(false), 2000);
      } catch {
        toast({
          title: "Error",
          description: "No se pudo copiar la dirección",
          variant: "destructive",
        });
      }
    }
  }, [address, toast]);

  const openInMaps = (service: 'google' | 'apple' | 'waze') => {
    if (!mapCoords) return;

    const urls = getMapUrls(mapCoords, venue);
    
    switch (service) {
      case 'google':
        window.open(urls.googleDirections, '_blank');
        break;
      case 'apple':
        window.open(urls.apple, '_blank');
        break;
      case 'waze':
        window.open(urls.waze, '_blank');
        break;
    }
  };

  // Static map image URL (using OpenStreetMap tiles)
  const getStaticMapUrl = (coords: MapCoordinates) => {
    const zoom = 15;
    const width = 600;
    const height = 300;
    
    // Using MapBox static API alternative or OpenStreetMap
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(${coords.lng},${coords.lat})/${coords.lng},${coords.lat},${zoom}/${width}x${height}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
  };

  if (!venue && !address) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación del Evento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Venue Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">{venue}</h4>
          {address && (
            <div className="flex items-start gap-2">
              <p className="text-muted-foreground flex-1 text-sm">{address}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="p-1 h-auto"
              >
                {copiedAddress ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Map Display */}
        {isLoading && (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{mapError}</p>
            </div>
          </div>
        )}

        {mapCoords && !isLoading && !mapError && (
          <div className="space-y-4">
            {/* Static Map Image */}
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={getStaticMapUrl(mapCoords)}
                alt={`Mapa de ${venue}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to OpenStreetMap iframe
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.parentElement?.querySelector('.fallback-map') as HTMLDivElement;
                  if (fallbackDiv) fallbackDiv.style.display = 'block';
                }}
              />
              {/* Fallback iframe */}
              <div 
                style={{ display: 'none' }}
                className="w-full h-full fallback-map"
              >
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lng-0.01},${mapCoords.lat-0.01},${mapCoords.lng+0.01},${mapCoords.lat+0.01}&layer=mapnik&marker=${mapCoords.lat},${mapCoords.lng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Mapa de ${venue}`}
                />
              </div>
              
              {/* Map overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => openInMaps('google')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver mapa completo
                </Button>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="space-y-3">
              <h5 className="font-medium flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Cómo llegar
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInMaps('google')}
                  className="justify-start"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Google Maps
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInMaps('waze')}
                  className="justify-start"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Waze
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInMaps('apple')}
                  className="justify-start"
                >
                  <Train className="h-4 w-4 mr-2" />
                  Apple Maps
                </Button>
              </div>
            </div>

            {/* Travel Time Estimates (Mock data - would integrate with real API) */}
            <div className="space-y-2">
              <h6 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Tiempo estimado desde el centro
              </h6>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">
                  <Car className="h-3 w-3 mr-1" />
                  15 min en carro
                </Badge>
                <Badge variant="secondary">
                  <Train className="h-3 w-3 mr-1" />
                  25 min en transporte público
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Manual navigation for cases without coordinates */}
        {!mapCoords && !isLoading && address && (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(`${venue}, ${address}`)}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buscar en Google Maps
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
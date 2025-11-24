"use client";

import { MapPin, Navigation, Car, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationBlockData, ColorScheme } from "@/types/invitation-blocks";

interface LocationBlockProps {
  data: LocationBlockData;
  colorScheme: ColorScheme;
}

export function LocationBlock({ data, colorScheme }: LocationBlockProps) {
  const googleMapsUrl = data.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${data.coordinates.lat},${data.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;

  const wazeUrl = data.coordinates
    ? `https://waze.com/ul?ll=${data.coordinates.lat},${data.coordinates.lng}&navigate=yes`
    : null;

  return (
    <div className="py-16 px-4" style={{ backgroundColor: colorScheme.background }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Ubicación
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
          <p style={{ color: colorScheme.textLight }}>
            Nos encantaría verte en nuestro evento
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map */}
          <div className="relative rounded-lg overflow-hidden shadow-lg h-80">
            <iframe
              src={
                data.coordinates
                  ? `https://maps.google.com/maps?q=${data.coordinates.lat},${data.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=${encodeURIComponent(data.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Address */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin
                  className="h-6 w-6 mt-1 flex-shrink-0"
                  style={{ color: colorScheme.primary }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colorScheme.primary }}
                  >
                    Dirección
                  </h3>
                  <p style={{ color: colorScheme.text }}>{data.address}</p>
                </div>
              </div>
            </div>

            {/* Directions */}
            {data.directions && (
              <div className="flex items-start gap-3">
                <Navigation
                  className="h-6 w-6 mt-1 flex-shrink-0"
                  style={{ color: colorScheme.primary }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colorScheme.primary }}
                  >
                    Cómo llegar
                  </h3>
                  <p style={{ color: colorScheme.text }}>{data.directions}</p>
                </div>
              </div>
            )}

            {/* Parking */}
            {data.parkingInfo && (
              <div className="flex items-start gap-3">
                <Car
                  className="h-6 w-6 mt-1 flex-shrink-0"
                  style={{ color: colorScheme.primary }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colorScheme.primary }}
                  >
                    Estacionamiento
                  </h3>
                  <p style={{ color: colorScheme.text }}>{data.parkingInfo}</p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="space-y-3 pt-4">
              <Button
                className="w-full"
                asChild
                style={{
                  backgroundColor: colorScheme.primary,
                  color: 'white',
                }}
              >
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en Google Maps
                </a>
              </Button>

              {wazeUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  style={{
                    borderColor: colorScheme.primary,
                    color: colorScheme.primary,
                  }}
                >
                  <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="h-4 w-4 mr-2" />
                    Abrir en Waze
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

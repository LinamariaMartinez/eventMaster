"use client";

import { Clock, MapPin, Music, Utensils, Camera, Gift } from "lucide-react";
import type { TimelineBlockData, ColorScheme } from "@/types/invitation-blocks";

interface TimelineBlockProps {
  data: TimelineBlockData;
  colorScheme: ColorScheme;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  location: MapPin,
  music: Music,
  food: Utensils,
  camera: Camera,
  gift: Gift,
};

export function TimelineBlock({ data, colorScheme }: TimelineBlockProps) {
  return (
    <div className="py-16 px-4" style={{ backgroundColor: colorScheme.background }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Cronograma del Evento
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
          <p style={{ color: colorScheme.textLight }}>
            Así transcurrirá nuestro día especial
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: colorScheme.secondary }}
          ></div>

          {/* Events */}
          <div className="space-y-12">
            {data.events.map((event, index) => {
              const Icon = event.icon && iconMap[event.icon] ? iconMap[event.icon] : Clock;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${
                      isEven ? 'md:pr-12 pl-16 md:pl-0' : 'md:pl-12 pl-16 md:pr-0'
                    }`}
                  >
                    <div
                      className={`bg-white rounded-lg p-6 shadow-md ${
                        isEven ? 'md:text-right' : 'md:text-left'
                      } text-left`}
                      style={{ borderColor: colorScheme.accent, borderLeftWidth: '4px' }}
                    >
                      <div
                        className="text-sm font-semibold mb-2"
                        style={{ color: colorScheme.accent }}
                      >
                        {event.time}
                      </div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: colorScheme.primary }}
                      >
                        {event.title}
                      </h3>
                      {event.description && (
                        <p style={{ color: colorScheme.textLight }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Icon in the center */}
                  <div
                    className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: colorScheme.primary }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

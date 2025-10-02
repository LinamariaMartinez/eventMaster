"use client";

import { Utensils, AlertCircle } from "lucide-react";
import type { MenuBlockData, ColorScheme } from "@/types/invitation-blocks";

interface MenuBlockProps {
  data: MenuBlockData;
  colorScheme: ColorScheme;
}

export function MenuBlock({ data, colorScheme }: MenuBlockProps) {
  return (
    <div
      className="py-16 px-4"
      style={{ backgroundColor: colorScheme.secondary }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Menú
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-4"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
          <p style={{ color: colorScheme.textLight }}>
            Deliciosos platillos preparados especialmente para ti
          </p>
        </div>

        {/* Menu sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {data.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-lg p-6 shadow-md"
            >
              <h3
                className="text-2xl font-serif font-bold mb-6 pb-3 border-b-2"
                style={{
                  color: colorScheme.primary,
                  borderColor: colorScheme.accent,
                }}
              >
                {section.name}
              </h3>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <h4
                      className="font-semibold text-lg"
                      style={{ color: colorScheme.text }}
                    >
                      {item.name}
                    </h4>
                    {item.description && (
                      <p
                        className="text-sm"
                        style={{ color: colorScheme.textLight }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <AlertCircle
                          className="h-3 w-3"
                          style={{ color: colorScheme.accent }}
                        />
                        <span style={{ color: colorScheme.textLight }}>
                          Contiene: {item.allergens.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p
            className="text-sm italic"
            style={{ color: colorScheme.textLight }}
          >
            Si tienes alguna restricción alimentaria, por favor háznoslo saber en el formulario de confirmación
          </p>
        </div>
      </div>
    </div>
  );
}

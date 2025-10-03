"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import type { StoryBlockData, ColorScheme } from "@/types/invitation-blocks";

interface StoryBlockProps {
  data: StoryBlockData;
  colorScheme: ColorScheme;
}

export function StoryBlock({ data, colorScheme }: StoryBlockProps) {
  return (
    <div
      className="py-16 px-4"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            {data.title || "Nuestra Historia"}
          </h2>
          <div
            className="w-24 h-1 mx-auto"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
        </div>

        {/* Story Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          {data.image && (
            <div className="order-2 md:order-1 relative w-full h-96">
              <Image
                src={data.image}
                alt={data.title || "Historia"}
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          )}
          <div className={data.image ? "order-1 md:order-2" : "col-span-2"}>
            <p
              style={{ color: colorScheme.text }}
              className="text-lg leading-relaxed whitespace-pre-line"
            >
              {data.content}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {data.timeline && data.timeline.length > 0 && (
          <div className="mt-12">
            <h3
              className="text-2xl font-serif font-semibold text-center mb-8"
              style={{ color: colorScheme.primary }}
            >
              Momentos Importantes
            </h3>
            <div className="space-y-6">
              {data.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{
                      backgroundColor: colorScheme.accent,
                      color: colorScheme.primary,
                    }}
                  >
                    {item.year}
                  </div>
                  <div className="flex-1 pt-4">
                    <p
                      style={{ color: colorScheme.text }}
                      className="text-lg"
                    >
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

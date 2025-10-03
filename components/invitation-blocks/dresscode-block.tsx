"use client";

import Image from "next/image";
import { Shirt } from "lucide-react";
import type { DressCodeBlockData, ColorScheme } from "@/types/invitation-blocks";

interface DressCodeBlockProps {
  data: DressCodeBlockData;
  colorScheme: ColorScheme;
}

export function DressCodeBlock({ data, colorScheme }: DressCodeBlockProps) {
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
            <Shirt className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Código de Vestimenta
          </h2>
          <div
            className="w-24 h-1 mx-auto"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {data.image && (
            <div className="relative w-full h-96">
              <Image
                src={data.image}
                alt="Código de vestimenta"
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          )}
          <div className={data.image ? "" : "col-span-2 text-center"}>
            <div
              className="inline-block px-8 py-4 rounded-lg mb-6"
              style={{
                backgroundColor: colorScheme.accent,
              }}
            >
              <p
                className="text-2xl font-semibold"
                style={{ color: colorScheme.primary }}
              >
                {data.code}
              </p>
            </div>
            {data.description && (
              <p
                style={{ color: colorScheme.text }}
                className="text-lg mb-6 leading-relaxed"
              >
                {data.description}
              </p>
            )}
            {data.examples && data.examples.length > 0 && (
              <div className="space-y-2">
                <p
                  style={{ color: colorScheme.textLight }}
                  className="font-medium mb-3"
                >
                  Sugerencias:
                </p>
                <ul className="space-y-2">
                  {data.examples.map((example, index) => (
                    <li
                      key={index}
                      style={{ color: colorScheme.text }}
                      className="flex items-center"
                    >
                      <span
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: colorScheme.accent }}
                      ></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

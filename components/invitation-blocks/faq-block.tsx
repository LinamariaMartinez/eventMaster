"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { FaqBlockData, ColorScheme } from "@/types/invitation-blocks";

interface FaqBlockProps {
  data: FaqBlockData;
  colorScheme: ColorScheme;
}

export function FaqBlock({ data, colorScheme }: FaqBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="py-16 px-4"
      style={{ backgroundColor: colorScheme.background }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Preguntas Frecuentes
          </h2>
          <div
            className="w-24 h-1 mx-auto"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
        </div>

        {/* FAQ Items */}
        {data.questions && data.questions.length > 0 && (
          <div className="space-y-4">
            {data.questions.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span
                    className="text-lg font-semibold pr-4"
                    style={{ color: colorScheme.primary }}
                  >
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: colorScheme.accent }}
                    />
                  ) : (
                    <ChevronDown
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: colorScheme.accent }}
                    />
                  )}
                </button>
                {openIndex === index && (
                  <div
                    className="px-6 py-4 border-t"
                    style={{ borderColor: colorScheme.accent }}
                  >
                    <p
                      style={{ color: colorScheme.text }}
                      className="leading-relaxed"
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

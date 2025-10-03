"use client";

import { Gift, ExternalLink, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GiftsBlockData, ColorScheme } from "@/types/invitation-blocks";

interface GiftsBlockProps {
  data: GiftsBlockData;
  colorScheme: ColorScheme;
}

export function GiftsBlock({ data, colorScheme }: GiftsBlockProps) {
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
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2
            className="text-4xl font-serif font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            Mesa de Regalos
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-6"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
          {data.message && (
            <p
              style={{ color: colorScheme.text }}
              className="text-lg max-w-2xl mx-auto"
            >
              {data.message}
            </p>
          )}
        </div>

        {/* Registry Links */}
        {data.registries && data.registries.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {data.registries.map((registry, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-auto py-6 px-6"
                style={{
                  borderColor: colorScheme.primary,
                  color: colorScheme.primary,
                }}
                asChild
              >
                <a
                  href={registry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-lg font-semibold">{registry.name}</span>
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </Button>
            ))}
          </div>
        )}

        {/* Bank Account Details */}
        {data.showBankAccount && data.bankDetails && (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center justify-center mb-6">
              <CreditCard
                className="h-8 w-8"
                style={{ color: colorScheme.primary }}
              />
              <h3
                className="text-2xl font-semibold ml-3"
                style={{ color: colorScheme.primary }}
              >
                Datos Bancarios
              </h3>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b pb-2">
                <span
                  className="font-medium"
                  style={{ color: colorScheme.textLight }}
                >
                  Titular:
                </span>
                <span style={{ color: colorScheme.text }}>
                  {data.bankDetails.accountName}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span
                  className="font-medium"
                  style={{ color: colorScheme.textLight }}
                >
                  Banco:
                </span>
                <span style={{ color: colorScheme.text }}>
                  {data.bankDetails.bank}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span
                  className="font-medium"
                  style={{ color: colorScheme.textLight }}
                >
                  Tipo de cuenta:
                </span>
                <span style={{ color: colorScheme.text }}>
                  {data.bankDetails.accountType}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className="font-medium"
                  style={{ color: colorScheme.textLight }}
                >
                  Número de cuenta:
                </span>
                <span
                  style={{ color: colorScheme.text }}
                  className="font-mono font-bold"
                >
                  {data.bankDetails.accountNumber}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

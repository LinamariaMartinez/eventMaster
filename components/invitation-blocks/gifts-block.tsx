"use client";

import { Gift, ExternalLink, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GiftsBlockData, ColorScheme } from "@/types/invitation-blocks";

interface GiftsBlockProps {
  data: GiftsBlockData;
  colorScheme: ColorScheme;
}

export function GiftsBlock({ data, colorScheme }: GiftsBlockProps) {
  // Compatibilidad: Si no hay showEnvelopeRain definido pero hay message, asumimos lluvia de sobres
  const showEnvelopeRain = data.showEnvelopeRain ?? false;
  // Compatibilidad: Si no hay showRegistries definido pero hay registries, mostrarlos
  const showRegistries = data.showRegistries ?? (data.registries && data.registries.length > 0);
  const showBankAccount = data.showBankAccount ?? false;

  // Mensaje por defecto para lluvia de sobres
  const defaultEnvelopeMessage = "Tu presencia es nuestro mejor regalo, pero si deseas hacer un detalle, habrá un buzón especial en el evento";
  const envelopeMessage = data.envelopeRainMessage || data.message || defaultEnvelopeMessage;

  // Si no hay nada que mostrar, no renderizar el bloque
  if (!showEnvelopeRain && !showRegistries && !showBankAccount) {
    return null;
  }

  // Determinar si solo se muestra lluvia de sobres (diseño centrado)
  const onlyEnvelopeRain = showEnvelopeRain && !showRegistries && !showBankAccount;

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
            Regalos y Detalles
          </h2>
          <div
            className="w-24 h-1 mx-auto"
            style={{ backgroundColor: colorScheme.accent }}
          ></div>
        </div>

        {/* DISEÑO CENTRADO: Solo Lluvia de Sobres */}
        {onlyEnvelopeRain && (
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: `${colorScheme.primary}20` }}
            >
              <span className="text-5xl">💸</span>
            </div>
            <h3
              className="text-3xl font-semibold mb-4"
              style={{ color: colorScheme.primary }}
            >
              Lluvia de Sobres
            </h3>
            <p
              className="text-lg leading-relaxed"
              style={{ color: colorScheme.text }}
            >
              {envelopeMessage}
            </p>
          </div>
        )}

        {/* DISEÑO CON SECCIONES: Múltiples opciones */}
        {!onlyEnvelopeRain && (
          <div className="space-y-12">
            {/* Sección: Lluvia de Sobres */}
            {showEnvelopeRain && (
              <div className="bg-white rounded-lg p-8 shadow-md border-2" style={{ borderColor: colorScheme.accent }}>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">💸</span>
                  <h3
                    className="text-2xl font-semibold"
                    style={{ color: colorScheme.primary }}
                  >
                    Lluvia de Sobres
                  </h3>
                </div>
                <p
                  className="text-center text-lg max-w-xl mx-auto"
                  style={{ color: colorScheme.text }}
                >
                  {envelopeMessage}
                </p>
              </div>
            )}

            {/* Sección: Registry Links */}
            {showRegistries && data.registries && data.registries.length > 0 && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <DollarSign
                    className="h-6 w-6 mr-2"
                    style={{ color: colorScheme.primary }}
                  />
                  <h3
                    className="text-2xl font-semibold"
                    style={{ color: colorScheme.primary }}
                  >
                    Registros de Tiendas
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
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
              </div>
            )}

            {/* Sección: Bank Account Details */}
            {showBankAccount && data.bankDetails && (
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
        )}
      </div>
    </div>
  );
}

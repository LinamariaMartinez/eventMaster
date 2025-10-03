"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical } from "lucide-react";
import type { BlockConfig, EventType } from "@/types/invitation-blocks";

interface BlockTogglePanelProps {
  eventType: EventType;
  blocks: BlockConfig[];
  onBlocksChange: (blocks: BlockConfig[]) => void;
}

const BLOCK_LABELS: Record<string, { name: string; description: string }> = {
  hero: {
    name: "Hero / Banner Principal",
    description: "Título, fecha y cuenta regresiva"
  },
  timeline: {
    name: "Cronograma",
    description: "Itinerario del evento hora por hora"
  },
  location: {
    name: "Ubicación",
    description: "Mapa y direcciones"
  },
  menu: {
    name: "Menú",
    description: "Platillos y bebidas del evento"
  },
  rsvp: {
    name: "Confirmación (RSVP)",
    description: "Formulario para confirmar asistencia"
  },
  gallery: {
    name: "Galería de Fotos",
    description: "Colección de imágenes del evento"
  },
  story: {
    name: "Historia",
    description: "Historia de la pareja/cumpleañero"
  },
  gifts: {
    name: "Mesa de Regalos",
    description: "Links y datos bancarios"
  },
  dresscode: {
    name: "Código de Vestimenta",
    description: "Dress code del evento"
  },
  faq: {
    name: "Preguntas Frecuentes",
    description: "FAQs para invitados"
  },
};

export function BlockTogglePanel({ blocks, onBlocksChange }: BlockTogglePanelProps) {
  const [draggedBlock, setDraggedBlock] = useState<BlockConfig | null>(null);

  const toggleBlock = (blockType: string) => {
    const newBlocks = blocks.map(block =>
      block.type === blockType
        ? { ...block, enabled: !block.enabled }
        : block
    );
    onBlocksChange(newBlocks);
  };

  const handleDragStart = (block: BlockConfig) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetBlock: BlockConfig) => {
    if (!draggedBlock || draggedBlock.type === targetBlock.type) return;

    const newBlocks = [...blocks];
    const draggedIndex = newBlocks.findIndex(b => b.type === draggedBlock.type);
    const targetIndex = newBlocks.findIndex(b => b.type === targetBlock.type);

    // Swap orders
    const draggedOrder = newBlocks[draggedIndex].order;
    newBlocks[draggedIndex].order = newBlocks[targetIndex].order;
    newBlocks[targetIndex].order = draggedOrder;

    // Sort by new order
    newBlocks.sort((a, b) => a.order - b.order);

    onBlocksChange(newBlocks);
    setDraggedBlock(null);
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bloques de la Invitación</CardTitle>
        <CardDescription>
          Usa el switch para activar/desactivar bloques. Arrastra para reordenarlos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedBlocks.map((block) => {
            const label = BLOCK_LABELS[block.type];
            if (!label) return null;

            return (
              <div
                key={block.type}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  block.enabled
                    ? 'bg-white border-burgundy/30 hover:border-burgundy/50 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Drag handle */}
                <div
                  draggable
                  onDragStart={() => handleDragStart(block)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(block)}
                  className="cursor-move"
                >
                  <GripVertical className={`h-5 w-5 flex-shrink-0 ${block.enabled ? 'text-burgundy' : 'text-gray-400'}`} />
                </div>

                {/* Block info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${block.enabled ? 'text-burgundy' : 'text-gray-500'}`}>
                      {label.name}
                    </span>
                    {block.enabled ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Activo
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{label.description}</p>
                </div>

                {/* Toggle switch */}
                <div className="flex flex-col items-end gap-1">
                  <Switch
                    checked={block.enabled}
                    onCheckedChange={() => toggleBlock(block.type)}
                  />
                  <span className="text-xs text-gray-400">
                    {block.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>💡 Tip: Arrastra los bloques para cambiar el orden en que aparecen</p>
        </div>
      </CardContent>
    </Card>
  );
}

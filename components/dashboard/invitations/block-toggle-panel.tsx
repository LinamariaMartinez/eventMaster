"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Eye, EyeOff } from "lucide-react";
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
          Activa/desactiva bloques y arrastra para reordenar
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
                draggable
                onDragStart={() => handleDragStart(block)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(block)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
                  block.enabled
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                {/* Drag handle */}
                <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />

                {/* Block info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {block.enabled ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">{label.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{label.description}</p>
                </div>

                {/* Toggle switch */}
                <Switch
                  checked={block.enabled}
                  onCheckedChange={() => toggleBlock(block.type)}
                  onClick={(e) => e.stopPropagation()}
                />
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

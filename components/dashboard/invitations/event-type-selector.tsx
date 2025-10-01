"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Cake, Briefcase } from "lucide-react";
import type { EventType } from "@/types/invitation-blocks";

interface EventTypeSelectorProps {
  selectedType: EventType;
  onTypeChange: (type: EventType) => void;
}

const EVENT_TYPES: Array<{
  id: EventType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}> = [
  {
    id: 'wedding',
    name: 'Boda',
    description: 'Invitación elegante para bodas',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    id: 'birthday',
    name: 'Cumpleaños',
    description: 'Invitación festiva para cumpleaños',
    icon: Cake,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 border-pink-200',
  },
  {
    id: 'corporate',
    name: 'Evento Corporativo',
    description: 'Invitación profesional para eventos de empresa',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
];

export function EventTypeSelector({ selectedType, onTypeChange }: EventTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {EVENT_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected
                ? `${type.bgColor} border-2 shadow-md`
                : 'border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTypeChange(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                isSelected ? type.bgColor : 'bg-gray-100'
              }`}>
                <Icon className={`h-8 w-8 ${isSelected ? type.color : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-bold text-lg mb-2 ${isSelected ? type.color : 'text-gray-900'}`}>
                {type.name}
              </h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

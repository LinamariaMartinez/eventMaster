"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type {
  BlockType,
  HeroBlockData,
  TimelineBlockData,
  LocationBlockData,
  MenuBlockData,
  RsvpBlockData,
} from "@/types/invitation-blocks";

type BlockData = HeroBlockData | TimelineBlockData | LocationBlockData | MenuBlockData | RsvpBlockData | Record<string, unknown>;

interface BlockContentEditorProps {
  blockType: BlockType;
  data: BlockData;
  onChange: (data: BlockData) => void;
}

export function BlockContentEditor({ blockType, data, onChange }: BlockContentEditorProps) {
  switch (blockType) {
    case 'hero':
      return <HeroEditor data={data as HeroBlockData} onChange={onChange as (data: HeroBlockData) => void} />;
    case 'timeline':
      return <TimelineEditor data={data as TimelineBlockData} onChange={onChange as (data: TimelineBlockData) => void} />;
    case 'location':
      return <LocationEditor data={data as LocationBlockData} onChange={onChange as (data: LocationBlockData) => void} />;
    case 'menu':
      return <MenuEditor data={data as MenuBlockData} onChange={onChange as (data: MenuBlockData) => void} />;
    case 'rsvp':
      return <RsvpEditor data={data as RsvpBlockData} onChange={onChange as (data: RsvpBlockData) => void} />;
    case 'gallery':
      return <GalleryEditor />;
    case 'story':
      return <StoryEditor />;
    case 'gifts':
      return <GiftsEditor />;
    case 'dresscode':
      return <DressCodeEditor />;
    case 'faq':
      return <FaqEditor />;
    default:
      return <div className="text-gray-500">Editor para este bloque próximamente</div>;
  }
}

// Hero Block Editor
function HeroEditor({ data, onChange }: { data: HeroBlockData; onChange: (data: HeroBlockData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hero-title">Título</Label>
        <Input
          id="hero-title"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Ej: Nuestra Boda"
        />
      </div>
      <div>
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Input
          id="hero-subtitle"
          value={data.subtitle || ''}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="Ej: Celebra con nosotros este día especial"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="hero-countdown"
          checked={data.showCountdown || false}
          onCheckedChange={(checked) => onChange({ ...data, showCountdown: checked })}
        />
        <Label htmlFor="hero-countdown">Mostrar cuenta regresiva</Label>
      </div>
    </div>
  );
}

// Timeline Block Editor
function TimelineEditor({ data, onChange }: { data: TimelineBlockData; onChange: (data: TimelineBlockData) => void }) {
  const events = data.events || [];

  const addEvent = () => {
    onChange({
      ...data,
      events: [...events, { time: '', title: '', description: '' }],
    });
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    onChange({ ...data, events: newEvents });
  };

  const removeEvent = (index: number) => {
    onChange({ ...data, events: events.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <Card key={index}>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Evento {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEvent(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <Input
              placeholder="Hora (ej: 15:00)"
              value={event.time}
              onChange={(e) => updateEvent(index, 'time', e.target.value)}
            />
            <Input
              placeholder="Título"
              value={event.title}
              onChange={(e) => updateEvent(index, 'title', e.target.value)}
            />
            <Input
              placeholder="Descripción (opcional)"
              value={event.description || ''}
              onChange={(e) => updateEvent(index, 'description', e.target.value)}
            />
          </CardContent>
        </Card>
      ))}
      <Button onClick={addEvent} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Evento
      </Button>
    </div>
  );
}

// Location Block Editor
function LocationEditor({ data, onChange }: { data: LocationBlockData; onChange: (data: LocationBlockData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-address">Dirección</Label>
        <Input
          id="location-address"
          value={data.address || ''}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Ej: Calle 123, Ciudad"
        />
      </div>
      <div>
        <Label htmlFor="location-directions">Indicaciones (opcional)</Label>
        <Textarea
          id="location-directions"
          value={data.directions || ''}
          onChange={(e) => onChange({ ...data, directions: e.target.value })}
          placeholder="Cómo llegar..."
        />
      </div>
      <div>
        <Label htmlFor="location-parking">Información de estacionamiento (opcional)</Label>
        <Textarea
          id="location-parking"
          value={data.parkingInfo || ''}
          onChange={(e) => onChange({ ...data, parkingInfo: e.target.value })}
          placeholder="Información sobre estacionamiento..."
        />
      </div>
    </div>
  );
}

// Menu Block Editor
function MenuEditor({ data, onChange }: { data: MenuBlockData; onChange: (data: MenuBlockData) => void }) {
  const sections = data.sections || [];

  const addSection = () => {
    onChange({
      ...data,
      sections: [...sections, { name: '', items: [] }],
    });
  };

  const addItem = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.push({ name: '', description: '' });
    onChange({ ...data, sections: newSections });
  };

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <Card key={sectionIndex}>
          <CardHeader>
            <Input
              placeholder="Nombre de la sección (ej: Entradas)"
              value={section.name}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[sectionIndex].name = e.target.value;
                onChange({ ...data, sections: newSections });
              }}
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-2 p-3 border rounded">
                <Input
                  placeholder="Nombre del platillo"
                  value={item.name}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[sectionIndex].items[itemIndex].name = e.target.value;
                    onChange({ ...data, sections: newSections });
                  }}
                />
                <Input
                  placeholder="Descripción"
                  value={item.description || ''}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[sectionIndex].items[itemIndex].description = e.target.value;
                    onChange({ ...data, sections: newSections });
                  }}
                />
              </div>
            ))}
            <Button
              onClick={() => addItem(sectionIndex)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Platillo
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addSection} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Sección
      </Button>
    </div>
  );
}

// RSVP Block Editor
function RsvpEditor({ data, onChange }: { data: RsvpBlockData; onChange: (data: RsvpBlockData) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="rsvp-plusones"
          checked={data.allowPlusOnes || false}
          onCheckedChange={(checked) => onChange({ ...data, allowPlusOnes: checked })}
        />
        <Label htmlFor="rsvp-plusones">Permitir acompañantes</Label>
      </div>
      <div>
        <Label htmlFor="rsvp-maxguests">Máximo de invitados por confirmación</Label>
        <Input
          id="rsvp-maxguests"
          type="number"
          value={data.maxGuestsPerInvite || 5}
          onChange={(e) => onChange({ ...data, maxGuestsPerInvite: parseInt(e.target.value) })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="rsvp-email"
          checked={data.requireEmail || false}
          onCheckedChange={(checked) => onChange({ ...data, requireEmail: checked })}
        />
        <Label htmlFor="rsvp-email">Requerir email</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="rsvp-phone"
          checked={data.requirePhone || false}
          onCheckedChange={(checked) => onChange({ ...data, requirePhone: checked })}
        />
        <Label htmlFor="rsvp-phone">Requerir teléfono</Label>
      </div>
    </div>
  );
}

// Placeholder editors for other blocks
function GalleryEditor() {
  return <div className="text-gray-500 p-4">Editor de galería próximamente</div>;
}

function StoryEditor() {
  return <div className="text-gray-500 p-4">Editor de historia próximamente</div>;
}

function GiftsEditor() {
  return <div className="text-gray-500 p-4">Editor de regalos próximamente</div>;
}

function DressCodeEditor() {
  return <div className="text-gray-500 p-4">Editor de código de vestimenta próximamente</div>;
}

function FaqEditor() {
  return <div className="text-gray-500 p-4">Editor de preguntas frecuentes próximamente</div>;
}

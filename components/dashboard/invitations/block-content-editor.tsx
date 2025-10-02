"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./image-uploader";
import type {
  BlockType,
  HeroBlockData,
  TimelineBlockData,
  LocationBlockData,
  MenuBlockData,
  RsvpBlockData,
  GalleryBlockData,
} from "@/types/invitation-blocks";

type BlockData = HeroBlockData | TimelineBlockData | LocationBlockData | MenuBlockData | RsvpBlockData | Record<string, unknown>;

interface BlockContentEditorProps {
  blockType: BlockType;
  data: BlockData;
  onChange: (data: BlockData) => void;
  eventId?: string;
}

export function BlockContentEditor({ blockType, data, onChange, eventId = 'default' }: BlockContentEditorProps) {
  switch (blockType) {
    case 'hero':
      return <HeroEditor data={data as HeroBlockData} onChange={onChange as (data: HeroBlockData) => void} eventId={eventId} />;
    case 'timeline':
      return <TimelineEditor data={data as TimelineBlockData} onChange={onChange as (data: TimelineBlockData) => void} />;
    case 'location':
      return <LocationEditor data={data as LocationBlockData} onChange={onChange as (data: LocationBlockData) => void} />;
    case 'menu':
      return <MenuEditor data={data as MenuBlockData} onChange={onChange as (data: MenuBlockData) => void} />;
    case 'rsvp':
      return <RsvpEditor data={data as RsvpBlockData} onChange={onChange as (data: RsvpBlockData) => void} />;
    case 'gallery':
      return <GalleryEditor data={data as GalleryBlockData} onChange={onChange as (data: GalleryBlockData) => void} eventId={eventId} />;
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
function HeroEditor({
  data,
  onChange,
  eventId
}: {
  data: HeroBlockData;
  onChange: (data: HeroBlockData) => void;
  eventId: string;
}) {
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
      <div>
        <ImageUploader
          value={data.backgroundImage}
          onChange={(url) => onChange({ ...data, backgroundImage: url })}
          eventId={eventId}
          label="Imagen de fondo (opcional)"
          description="Se mostrará como fondo del banner principal"
          aspectRatio="21/9"
        />
      </div>

      {/* Text Styling Options */}
      <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-semibold text-sm">Estilo del Texto Principal</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="hero-text-color">Color del Texto</Label>
            <div className="flex gap-2 items-center mt-1">
              <Input
                id="hero-text-color"
                type="color"
                value={data.textColor || '#ffffff'}
                onChange={(e) => onChange({ ...data, textColor: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={data.textColor || '#ffffff'}
                onChange={(e) => onChange({ ...data, textColor: e.target.value })}
                className="flex-1 font-mono text-sm"
                placeholder="#ffffff"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Para título y subtítulo</p>
          </div>
          <div>
            <Label htmlFor="hero-text-shadow">Intensidad de Sombra</Label>
            <select
              id="hero-text-shadow"
              value={data.textShadow || 'strong'}
              onChange={(e) => {
                const shadows = {
                  none: 'none',
                  light: '1px 1px 2px rgba(0,0,0,0.5)',
                  medium: '1px 1px 4px rgba(0,0,0,0.8)',
                  strong: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                };
                onChange({ ...data, textShadow: shadows[e.target.value as keyof typeof shadows] });
              }}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              <option value="none">Sin sombra</option>
              <option value="light">Ligera</option>
              <option value="medium">Media</option>
              <option value="strong">Fuerte (recomendado)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Mejora legibilidad sobre imágenes</p>
          </div>
        </div>
      </div>

      {/* Date/Time Styling Options */}
      <div className="space-y-3 p-4 border rounded-lg bg-blue-50">
        <h4 className="font-semibold text-sm">Estilo de Fecha y Hora</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="hero-date-color">Color de Fecha/Hora</Label>
            <div className="flex gap-2 items-center mt-1">
              <Input
                id="hero-date-color"
                type="color"
                value={data.dateColor || data.textColor || '#ffffff'}
                onChange={(e) => onChange({ ...data, dateColor: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={data.dateColor || data.textColor || '#ffffff'}
                onChange={(e) => onChange({ ...data, dateColor: e.target.value })}
                className="flex-1 font-mono text-sm"
                placeholder="#ffffff"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Color específico para fecha y hora</p>
          </div>
          <div>
            <Label htmlFor="hero-date-shadow">Sombra de Fecha</Label>
            <select
              id="hero-date-shadow"
              value={(() => {
                const currentShadow = data.dateShadow || data.textShadow || '1px 1px 4px rgba(0,0,0,0.8)';
                if (currentShadow === 'none') return 'none';
                if (currentShadow === '1px 1px 2px rgba(0,0,0,0.5)') return 'light';
                if (currentShadow === '1px 1px 4px rgba(0,0,0,0.8)') return 'medium';
                if (currentShadow === '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)') return 'strong';
                return 'medium';
              })()}
              onChange={(e) => {
                const shadows = {
                  none: 'none',
                  light: '1px 1px 2px rgba(0,0,0,0.5)',
                  medium: '1px 1px 4px rgba(0,0,0,0.8)',
                  strong: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                };
                onChange({ ...data, dateShadow: shadows[e.target.value as keyof typeof shadows] });
              }}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              <option value="none">Sin sombra</option>
              <option value="light">Ligera</option>
              <option value="medium">Media</option>
              <option value="strong">Fuerte</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Sombra independiente para fecha</p>
          </div>
        </div>
        <div>
          <Label htmlFor="hero-date-size">Tamaño de Fecha/Hora</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button
              type="button"
              variant={data.dateSize === 'small' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...data, dateSize: 'small' })}
              className="w-full"
            >
              Pequeño
            </Button>
            <Button
              type="button"
              variant={(data.dateSize || 'medium') === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...data, dateSize: 'medium' })}
              className="w-full"
            >
              Mediano
            </Button>
            <Button
              type="button"
              variant={data.dateSize === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange({ ...data, dateSize: 'large' })}
              className="w-full"
            >
              Grande
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Tamaño del texto de fecha y hora</p>
        </div>
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

// Gallery Block Editor
function GalleryEditor({
  data,
  onChange,
  eventId
}: {
  data: GalleryBlockData;
  onChange: (data: GalleryBlockData) => void;
  eventId: string;
}) {
  const images = data.images || [];

  const addImage = (url: string) => {
    onChange({
      ...data,
      images: [...images, { url, caption: '' }],
    });
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onChange({ ...data, images: newImages });
  };

  const removeImage = (index: number) => {
    onChange({
      ...data,
      images: images.filter((_, i) => i !== index),
    });
  };

  const setLayout = (layout: 'grid' | 'masonry' | 'carousel') => {
    onChange({ ...data, layout });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Diseño de galería</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button
            variant={data.layout === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('grid')}
          >
            Cuadrícula
          </Button>
          <Button
            variant={data.layout === 'masonry' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('masonry')}
          >
            Mosaico
          </Button>
          <Button
            variant={data.layout === 'carousel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('carousel')}
          >
            Carrusel
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {images.map((image, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Imagen {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <ImageUploader
                value={image.url}
                onChange={(url) => {
                  const newImages = [...images];
                  newImages[index] = { ...newImages[index], url };
                  onChange({ ...data, images: newImages });
                }}
                eventId={eventId}
                aspectRatio="4/3"
              />
              <Input
                placeholder="Descripción (opcional)"
                value={image.caption || ''}
                onChange={(e) => updateCaption(index, e.target.value)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <ImageUploader
        value=""
        onChange={addImage}
        eventId={eventId}
        label="Agregar nueva imagen"
        aspectRatio="4/3"
      />
    </div>
  );
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

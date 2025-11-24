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
  StoryBlockData,
  GiftsBlockData,
  DressCodeBlockData,
  FaqBlockData,
} from "@/types/invitation-blocks";

type BlockData = HeroBlockData | TimelineBlockData | LocationBlockData | MenuBlockData | RsvpBlockData | GalleryBlockData | StoryBlockData | GiftsBlockData | DressCodeBlockData | FaqBlockData | Record<string, unknown>;

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
      return <StoryEditor data={data as StoryBlockData} onChange={onChange as (data: StoryBlockData) => void} eventId={eventId} />;
    case 'gifts':
      return <GiftsEditor data={data as GiftsBlockData} onChange={onChange as (data: GiftsBlockData) => void} />;
    case 'dresscode':
      return <DressCodeEditor data={data as DressCodeBlockData} onChange={onChange as (data: DressCodeBlockData) => void} eventId={eventId} />;
    case 'faq':
      return <FaqEditor data={data as FaqBlockData} onChange={onChange as (data: FaqBlockData) => void} />;
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

      {/* Background Image Controls */}
      {data.backgroundImage && (
        <div className="space-y-3 p-4 border rounded-lg bg-purple-50">
          <h4 className="font-semibold text-sm">Control de Imagen de Fondo</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bg-size">Ajuste de Imagen</Label>
              <select
                id="bg-size"
                value={data.backgroundSize || 'cover'}
                onChange={(e) => onChange({ ...data, backgroundSize: e.target.value as 'cover' | 'contain' | 'auto' })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="cover">Cubrir (puede cortar)</option>
                <option value="contain">Contener (muestra completa)</option>
                <option value="auto">Original</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {data.backgroundSize === 'cover' && 'La imagen llena todo el espacio'}
                {data.backgroundSize === 'contain' && 'La imagen completa es visible'}
                {data.backgroundSize === 'auto' && 'Tamaño original de la imagen'}
              </p>
            </div>
            <div>
              <Label htmlFor="bg-position">Posición de Imagen</Label>
              <select
                id="bg-position"
                value={data.backgroundPosition || 'center'}
                onChange={(e) => onChange({ ...data, backgroundPosition: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="center">Centro</option>
                <option value="top">Superior</option>
                <option value="bottom">Inferior</option>
                <option value="left">Izquierda</option>
                <option value="right">Derecha</option>
                <option value="center 30%">Centro arriba (30%)</option>
                <option value="center 70%">Centro abajo (70%)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Ajusta qué parte de la imagen se muestra
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <p className="text-xs text-gray-600 mb-2">💡 <strong>Consejo para móvil:</strong></p>
            <p className="text-xs text-gray-500">
              Si la imagen se ve cortada en móvil, prueba usar "Contener" o ajusta la posición a "Centro arriba" o "Centro abajo"
            </p>
          </div>
        </div>
      )}

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

// Story Block Editor
function StoryEditor({
  data,
  onChange,
  eventId
}: {
  data: StoryBlockData;
  onChange: (data: StoryBlockData) => void;
  eventId: string;
}) {
  const addTimelineItem = () => {
    const currentTimeline = data.timeline || [];
    onChange({
      ...data,
      timeline: [...currentTimeline, { year: '', event: '' }]
    });
  };

  const removeTimelineItem = (index: number) => {
    const newTimeline = (data.timeline || []).filter((_, i) => i !== index);
    onChange({ ...data, timeline: newTimeline });
  };

  const updateTimelineItem = (index: number, field: 'year' | 'event', value: string) => {
    const newTimeline = [...(data.timeline || [])];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    onChange({ ...data, timeline: newTimeline });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="story-title">Título</Label>
        <Input
          id="story-title"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Ej: Nuestra Historia"
        />
      </div>
      <div>
        <Label htmlFor="story-content">Historia</Label>
        <Textarea
          id="story-content"
          value={data.content || ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Cuéntanos tu historia..."
          rows={6}
        />
      </div>
      <div>
        <ImageUploader
          value={data.image}
          onChange={(url) => onChange({ ...data, image: url })}
          eventId={eventId}
          label="Imagen (opcional)"
          aspectRatio="16/9"
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <Label>Momentos Importantes (opcional)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTimelineItem}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {(data.timeline || []).map((item, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
              <Input
                value={item.year}
                onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                placeholder="Año"
                className="w-24"
              />
              <Input
                value={item.event}
                onChange={(e) => updateTimelineItem(index, 'event', e.target.value)}
                placeholder="Evento"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTimelineItem(index)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Gifts Block Editor
function GiftsEditor({
  data,
  onChange
}: {
  data: GiftsBlockData;
  onChange: (data: GiftsBlockData) => void;
}) {
  const addRegistry = () => {
    const currentRegistries = data.registries || [];
    onChange({
      ...data,
      registries: [...currentRegistries, { name: '', url: '' }]
    });
  };

  const removeRegistry = (index: number) => {
    const newRegistries = (data.registries || []).filter((_, i) => i !== index);
    onChange({ ...data, registries: newRegistries });
  };

  const updateRegistry = (index: number, field: 'name' | 'url', value: string) => {
    const newRegistries = [...(data.registries || [])];
    newRegistries[index] = { ...newRegistries[index], [field]: value };
    onChange({ ...data, registries: newRegistries });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="gifts-message">Mensaje (opcional)</Label>
        <Textarea
          id="gifts-message"
          value={data.message || ''}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder="Tu presencia es nuestro mejor regalo..."
          rows={3}
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label>Links de Registro</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRegistry}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {(data.registries || []).map((registry, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  value={registry.name}
                  onChange={(e) => updateRegistry(index, 'name', e.target.value)}
                  placeholder="Nombre (Ej: Amazon, Liverpool)"
                />
                <Input
                  value={registry.url}
                  onChange={(e) => updateRegistry(index, 'url', e.target.value)}
                  placeholder="URL completa"
                  type="url"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRegistry(index)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-2 mb-3">
          <Switch
            id="show-bank"
            checked={data.showBankAccount || false}
            onCheckedChange={(checked) => onChange({ ...data, showBankAccount: checked })}
          />
          <Label htmlFor="show-bank">Mostrar datos bancarios</Label>
        </div>
        {data.showBankAccount && (
          <div className="space-y-3 pl-6">
            <Input
              value={data.bankDetails?.accountName || ''}
              onChange={(e) => onChange({
                ...data,
                bankDetails: { ...data.bankDetails!, accountName: e.target.value }
              })}
              placeholder="Nombre del titular"
            />
            <Input
              value={data.bankDetails?.bank || ''}
              onChange={(e) => onChange({
                ...data,
                bankDetails: { ...data.bankDetails!, bank: e.target.value }
              })}
              placeholder="Banco"
            />
            <Input
              value={data.bankDetails?.accountType || ''}
              onChange={(e) => onChange({
                ...data,
                bankDetails: { ...data.bankDetails!, accountType: e.target.value }
              })}
              placeholder="Tipo de cuenta (Ahorros/Corriente)"
            />
            <Input
              value={data.bankDetails?.accountNumber || ''}
              onChange={(e) => onChange({
                ...data,
                bankDetails: { ...data.bankDetails!, accountNumber: e.target.value }
              })}
              placeholder="Número de cuenta"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// DressCode Block Editor
function DressCodeEditor({
  data,
  onChange,
  eventId
}: {
  data: DressCodeBlockData;
  onChange: (data: DressCodeBlockData) => void;
  eventId: string;
}) {
  const addExample = () => {
    const currentExamples = data.examples || [];
    onChange({ ...data, examples: [...currentExamples, ''] });
  };

  const removeExample = (index: number) => {
    const newExamples = (data.examples || []).filter((_, i) => i !== index);
    onChange({ ...data, examples: newExamples });
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...(data.examples || [])];
    newExamples[index] = value;
    onChange({ ...data, examples: newExamples });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dresscode-code">Código de Vestimenta</Label>
        <Input
          id="dresscode-code"
          value={data.code || ''}
          onChange={(e) => onChange({ ...data, code: e.target.value })}
          placeholder="Ej: Formal, Semi-formal, Casual Elegante"
        />
      </div>
      <div>
        <Label htmlFor="dresscode-description">Descripción (opcional)</Label>
        <Textarea
          id="dresscode-description"
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Descripción adicional..."
          rows={3}
        />
      </div>
      <div>
        <ImageUploader
          value={data.image}
          onChange={(url) => onChange({ ...data, image: url })}
          eventId={eventId}
          label="Imagen de referencia (opcional)"
          aspectRatio="4/3"
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label>Sugerencias (opcional)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExample}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
        <div className="space-y-2">
          {(data.examples || []).map((example, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={example}
                onChange={(e) => updateExample(index, e.target.value)}
                placeholder="Ej: Vestido largo para damas"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExample(index)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// FAQ Block Editor
function FaqEditor({
  data,
  onChange
}: {
  data: FaqBlockData;
  onChange: (data: FaqBlockData) => void;
}) {
  const addQuestion = () => {
    const currentQuestions = data.questions || [];
    onChange({
      ...data,
      questions: [...currentQuestions, { question: '', answer: '' }]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = (data.questions || []).filter((_, i) => i !== index);
    onChange({ ...data, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    onChange({ ...data, questions: newQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Preguntas y Respuestas</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addQuestion}
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Pregunta
        </Button>
      </div>
      <div className="space-y-4">
        {(data.questions || []).map((item, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(index)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            <Input
              value={item.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              placeholder="Pregunta"
            />
            <Textarea
              value={item.answer}
              onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
              placeholder="Respuesta"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

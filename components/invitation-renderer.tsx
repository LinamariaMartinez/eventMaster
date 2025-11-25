"use client";

import type { Database } from "@/types/database.types";
import type {
  InvitationConfig,
  BlockConfig,
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
import {
  HeroBlock,
  TimelineBlock,
  LocationBlock,
  MenuBlock,
  RsvpBlock,
  GalleryBlock,
  StoryBlock,
  GiftsBlock,
  DressCodeBlock,
  FaqBlock,
} from "@/components/invitation-blocks";

type Event = Database['public']['Tables']['events']['Row'];

interface InvitationRendererProps {
  event: Event;
  config: InvitationConfig;
  blockData?: {
    hero?: HeroBlockData;
    timeline?: TimelineBlockData;
    location?: LocationBlockData;
    menu?: MenuBlockData;
    rsvp?: RsvpBlockData;
    gallery?: GalleryBlockData;
    story?: StoryBlockData;
    gifts?: GiftsBlockData;
    dresscode?: DressCodeBlockData;
    faq?: FaqBlockData;
  };
}

export function InvitationRenderer({
  event,
  config,
  blockData = {},
}: InvitationRendererProps) {
  // Get enabled blocks sorted by order
  const enabledBlocks = config.enabledBlocks
    .filter(block => block.enabled)
    .sort((a, b) => a.order - b.order);

  // Get typography settings
  const fontMap: Record<string, string> = {
    playfair: '"Playfair Display", serif',
    montserrat: '"Montserrat", sans-serif',
    lora: '"Lora", serif',
    raleway: '"Raleway", sans-serif',
    merriweather: '"Merriweather", serif',
    inter: '"Inter", sans-serif',
    cormorant: '"Cormorant", serif',
    poppins: '"Poppins", sans-serif',
  };

  const headingFont = config.customStyles?.headerFont ? fontMap[config.customStyles.headerFont as string] || fontMap.playfair : fontMap.playfair;
  const bodyFont = config.customStyles?.fontFamily ? fontMap[config.customStyles.fontFamily as string] || fontMap.inter : fontMap.inter;

  const fontScale = config.customStyles?.fontSize as string || 'medium';
  const scaleMultiplier = fontScale === 'small' ? 0.9 : fontScale === 'large' ? 1.1 : 1;

  // Render individual block based on type
  const renderBlock = (blockConfig: BlockConfig) => {
    const { type } = blockConfig;
    const colorScheme = config.colorScheme;

    switch (type) {
      case 'hero':
        return (
          <HeroBlock
            key={`hero-${blockConfig.order}`}
            data={blockData.hero || {
              title: event.title,
              subtitle: event.description || undefined,
              showCountdown: true,
            }}
            eventDate={event.date}
            eventTime={event.time}
            colorScheme={colorScheme}
          />
        );

      case 'timeline':
        if (!blockData.timeline) return null;
        return (
          <TimelineBlock
            key={`timeline-${blockConfig.order}`}
            data={blockData.timeline}
            colorScheme={colorScheme}
          />
        );

      case 'location':
        return (
          <LocationBlock
            key={`location-${blockConfig.order}`}
            data={blockData.location || {
              address: event.location,
            }}
            colorScheme={colorScheme}
          />
        );

      case 'menu':
        if (!blockData.menu) return null;
        return (
          <MenuBlock
            key={`menu-${blockConfig.order}`}
            data={blockData.menu}
            colorScheme={colorScheme}
          />
        );

      case 'rsvp':
        return (
          <RsvpBlock
            key={`rsvp-${blockConfig.order}`}
            data={blockData.rsvp || {
              allowPlusOnes: true,
              maxGuestsPerInvite: 5,
            }}
            eventId={event.id}
            eventTitle={event.title}
            eventDate={event.date}
            eventTime={event.time}
            eventLocation={event.location}
            eventWhatsappNumber={event.whatsapp_number}
            colorScheme={colorScheme}
          />
        );

      case 'gallery':
        if (!blockData.gallery) return null;
        return (
          <GalleryBlock
            key={`gallery-${blockConfig.order}`}
            data={blockData.gallery}
            colorScheme={colorScheme}
          />
        );

      case 'story':
        if (!blockData.story) return null;
        return (
          <StoryBlock
            key={`story-${blockConfig.order}`}
            data={blockData.story}
            colorScheme={colorScheme}
          />
        );

      case 'gifts':
        if (!blockData.gifts) return null;
        return (
          <GiftsBlock
            key={`gifts-${blockConfig.order}`}
            data={blockData.gifts}
            colorScheme={colorScheme}
          />
        );

      case 'dresscode':
        if (!blockData.dresscode) return null;
        return (
          <DressCodeBlock
            key={`dresscode-${blockConfig.order}`}
            data={blockData.dresscode}
            colorScheme={colorScheme}
          />
        );

      case 'faq':
        if (!blockData.faq) return null;
        return (
          <FaqBlock
            key={`faq-${blockConfig.order}`}
            data={blockData.faq}
            colorScheme={colorScheme}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen invitation-preview-container"
      style={{
        fontFamily: bodyFont,
        fontSize: `${scaleMultiplier}rem`,
      }}
    >
      <style jsx>{`
        .invitation-preview-container :global(h1),
        .invitation-preview-container :global(h2),
        .invitation-preview-container :global(h3),
        .invitation-preview-container :global(h4),
        .invitation-preview-container :global(h5),
        .invitation-preview-container :global(h6),
        .invitation-preview-container :global(.font-serif) {
          font-family: ${headingFont} !important;
        }

        .invitation-preview-container :global(p),
        .invitation-preview-container :global(span),
        .invitation-preview-container :global(.font-body) {
          font-family: ${bodyFont} !important;
        }
      `}</style>

      {/* Render all enabled blocks in order */}
      {enabledBlocks.map(blockConfig => renderBlock(blockConfig))}

      {/* WhatsApp CTA Section - Only show if whatsapp_number exists */}
      {/* Debug: {JSON.stringify({ whatsapp: event.whatsapp_number, hasValue: !!event.whatsapp_number })} */}
      {event.whatsapp_number && (
        <div
          className="py-16 px-4"
          style={{ backgroundColor: config.colorScheme.background }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <h2
                className="text-4xl font-serif font-bold mb-4"
                style={{ color: config.colorScheme.primary }}
              >
                ¿Confirmas tu asistencia?
              </h2>
              <div
                className="w-24 h-1 mx-auto mb-4"
                style={{ backgroundColor: config.colorScheme.accent }}
              ></div>
              <p
                className="text-lg"
                style={{ color: config.colorScheme.textLight }}
              >
                Envíanos un mensaje por WhatsApp y cuéntanos si podrás acompañarnos
              </p>
            </div>
            {/* Button */}
            <a
              href={`https://wa.me/${event.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, confirmo mi asistencia a ${event.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: '#25D366',
                color: 'white',
              }}
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Confirmar por WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="py-8 text-center text-sm"
        style={{
          backgroundColor: config.colorScheme.primary,
          color: config.colorScheme.footerTextColor || 'white',
          fontFamily: bodyFont,
        }}
      >
        <p>
          Creado con ❤️ usando{' '}
          <a
            href="https://eventmaster.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{
              color: config.colorScheme.footerTextColor || 'white',
            }}
          >
            EventMaster
          </a>
        </p>
      </div>
    </div>
  );
}

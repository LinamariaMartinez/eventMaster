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

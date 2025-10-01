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
} from "@/types/invitation-blocks";
import {
  HeroBlock,
  TimelineBlock,
  LocationBlock,
  MenuBlock,
  RsvpBlock,
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
            colorScheme={colorScheme}
          />
        );

      // Additional blocks can be added here in the future
      case 'gallery':
      case 'story':
      case 'gifts':
      case 'dresscode':
      case 'faq':
        return (
          <div
            key={`${type}-${blockConfig.order}`}
            className="py-16 px-4 text-center"
            style={{ backgroundColor: colorScheme.background }}
          >
            <p style={{ color: colorScheme.textLight }}>
              El bloque "{type}" estará disponible próximamente
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Render all enabled blocks in order */}
      {enabledBlocks.map(blockConfig => renderBlock(blockConfig))}

      {/* Footer */}
      <div
        className="py-8 text-center text-sm"
        style={{
          backgroundColor: config.colorScheme.primary,
          color: 'white',
        }}
      >
        <p>
          Creado con ❤️ usando{' '}
          <a
            href="https://eventmaster.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            EventMaster
          </a>
        </p>
      </div>
    </div>
  );
}

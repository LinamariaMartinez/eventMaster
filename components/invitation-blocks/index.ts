/**
 * Exportación centralizada de todos los bloques de invitación
 */

export { HeroBlock } from './hero-block';
export { TimelineBlock } from './timeline-block';
export { LocationBlock } from './location-block';
export { MenuBlock } from './menu-block';
export { RsvpBlock } from './rsvp-block';
export { GalleryBlock } from './gallery-block';

// Re-export types for convenience
export type {
  BlockType,
  BlockConfig,
  EventType,
  ColorScheme,
  InvitationConfig,
  HeroBlockData,
  TimelineBlockData,
  LocationBlockData,
  MenuBlockData,
  RsvpBlockData,
  GalleryBlockData,
} from '@/types/invitation-blocks';

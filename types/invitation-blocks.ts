/**
 * Sistema de Bloques para Invitaciones
 *
 * Arquitectura modular que permite configurar qué bloques mostrar
 * según el tipo de evento (wedding/birthday/corporate)
 */

// ============================================
// TIPOS DE EVENTO
// ============================================

export type EventType = 'wedding' | 'birthday' | 'corporate';

export interface EventTypeConfig {
  id: EventType;
  name: string;
  description: string;
  icon: string;
  defaultBlocks: BlockType[];
  colorScheme: ColorScheme;
}

// ============================================
// TIPOS DE BLOQUES
// ============================================

export type BlockType =
  | 'hero'           // Banner principal con título y fecha
  | 'timeline'       // Cronograma del evento
  | 'location'       // Mapa y dirección
  | 'menu'           // Menú del evento
  | 'rsvp'           // Formulario de confirmación
  | 'gallery'        // Galería de fotos
  | 'story'          // Historia de la pareja/cumpleañero
  | 'gifts'          // Mesa de regalos
  | 'dresscode'      // Código de vestimenta
  | 'faq';           // Preguntas frecuentes

export interface BlockConfig {
  type: BlockType;
  enabled: boolean;
  order: number;
  settings?: Record<string, unknown>;
}

// ============================================
// ESQUEMAS DE COLOR
// ============================================

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

export const DEFAULT_COLOR_SCHEMES: Record<EventType, ColorScheme> = {
  wedding: {
    primary: '#8B4F4F',      // burgundy
    secondary: '#F5E6D3',    // cream
    accent: '#D4AF37',       // gold
    background: '#FFFFFF',
    text: '#2D2D2D',
    textLight: '#6B6B6B',
  },
  birthday: {
    primary: '#FF6B9D',      // pink
    secondary: '#C8A2FF',    // purple
    accent: '#FFD93D',       // yellow
    background: '#FFF5F8',
    text: '#2D2D2D',
    textLight: '#6B6B6B',
  },
  corporate: {
    primary: '#1E3A8A',      // navy blue
    secondary: '#3B82F6',    // blue
    accent: '#10B981',       // green
    background: '#F9FAFB',
    text: '#1F2937',
    textLight: '#6B7280',
  },
};

// ============================================
// CONFIGURACIÓN DE INVITACIÓN
// ============================================

export interface InvitationConfig {
  eventType: EventType;
  enabledBlocks: BlockConfig[];
  colorScheme: ColorScheme;
  customStyles?: {
    fontFamily?: string;
    fontSize?: string;
    headerFont?: string;
  };
}

// ============================================
// DATOS DE BLOQUES ESPECÍFICOS
// ============================================

export interface HeroBlockData {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  showCountdown?: boolean;
  textShadow?: string;
  textColor?: string;
  dateColor?: string;
  dateShadow?: string;
  dateSize?: 'small' | 'medium' | 'large';
}

export interface TimelineBlockData {
  events: Array<{
    time: string;
    title: string;
    description?: string;
    icon?: string;
  }>;
}

export interface LocationBlockData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  directions?: string;
  parkingInfo?: string;
}

export interface MenuBlockData {
  sections: Array<{
    name: string;
    items: Array<{
      name: string;
      description?: string;
      allergens?: string[];
    }>;
  }>;
}

export interface RsvpBlockData {
  deadline?: string;
  requireEmail?: boolean;
  requirePhone?: boolean;
  allowPlusOnes?: boolean;
  maxGuestsPerInvite?: number;
  customQuestions?: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
}

export interface GalleryBlockData {
  images: Array<{
    url: string;
    caption?: string;
    thumbnail?: string;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface StoryBlockData {
  title: string;
  content: string;
  image?: string;
  timeline?: Array<{
    year: string;
    event: string;
  }>;
}

export interface GiftsBlockData {
  message?: string;
  registries: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
  showBankAccount?: boolean;
  bankDetails?: {
    accountName: string;
    bank: string;
    accountNumber: string;
    accountType: string;
  };
}

export interface DressCodeBlockData {
  code: string;
  description?: string;
  examples?: string[];
  image?: string;
}

export interface FaqBlockData {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

// ============================================
// BLOCK DATA TYPE UNION
// ============================================

export type BlockData =
  | HeroBlockData
  | TimelineBlockData
  | LocationBlockData
  | MenuBlockData
  | RsvpBlockData
  | GalleryBlockData
  | StoryBlockData
  | GiftsBlockData
  | DressCodeBlockData
  | FaqBlockData;

// ============================================
// UTILIDADES
// ============================================

export function getDefaultBlocks(eventType: EventType): BlockConfig[] {
  const commonBlocks: BlockConfig[] = [
    { type: 'hero', enabled: true, order: 0 },
    { type: 'location', enabled: true, order: 2 },
    { type: 'rsvp', enabled: true, order: 5 },
  ];

  const eventSpecificBlocks: Record<EventType, BlockConfig[]> = {
    wedding: [
      { type: 'story', enabled: true, order: 1 },
      { type: 'timeline', enabled: true, order: 3 },
      { type: 'menu', enabled: true, order: 4 },
      { type: 'gifts', enabled: true, order: 6 },
      { type: 'gallery', enabled: false, order: 7 },
      { type: 'dresscode', enabled: true, order: 8 },
      { type: 'faq', enabled: false, order: 9 },
    ],
    birthday: [
      { type: 'timeline', enabled: true, order: 1 },
      { type: 'gallery', enabled: true, order: 3 },
      { type: 'menu', enabled: true, order: 4 },
      { type: 'gifts', enabled: false, order: 6 },
      { type: 'dresscode', enabled: false, order: 7 },
    ],
    corporate: [
      { type: 'timeline', enabled: true, order: 1 },
      { type: 'menu', enabled: false, order: 3 },
      { type: 'faq', enabled: true, order: 4 },
    ],
  };

  return [
    ...commonBlocks,
    ...eventSpecificBlocks[eventType],
  ].sort((a, b) => a.order - b.order);
}

export function getDefaultColorScheme(eventType: EventType): ColorScheme {
  return DEFAULT_COLOR_SCHEMES[eventType];
}

export function createDefaultConfig(eventType: EventType): InvitationConfig {
  return {
    eventType,
    enabledBlocks: getDefaultBlocks(eventType),
    colorScheme: getDefaultColorScheme(eventType),
    customStyles: {
      fontFamily: eventType === 'wedding' ? 'serif' : 'sans-serif',
      fontSize: '16px',
      headerFont: eventType === 'wedding' ? 'playfair' : 'sans-serif',
    },
  };
}

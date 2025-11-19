"use client";

// Tipos para los datos que persistimos
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxGuests: number;
  confirmedGuests: number;
  status: "published" | "draft" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "confirmed" | "pending" | "declined";
  eventId: string;
  guestCount: number;
  message?: string;
  dietaryRestrictions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationType {
  id: "simple" | "premium";
  name: string;
  description: string;
  features: string[];
  price: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  category: "wedding" | "corporate" | "birthday";
  type: "simple" | "premium";
  thumbnail: string;
  styles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: string;
    backgroundImage?: string;
    gradientFrom?: string;
    gradientTo?: string;
    backgroundType: "solid" | "gradient" | "image";
  };
  layout: {
    headerHeight: number;
    contentPadding: number;
    borderRadius: number;
    shadowLevel: number;
  };
  features?: string[];
}

export interface Invitation {
  id: string;
  eventId: string;
  templateId: string;
  title: string;
  description: string;
  type: "simple" | "premium";
  customStyles: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    fontSize: string;
    backgroundImage?: string;
    gradientFrom?: string;
    gradientTo?: string;
    backgroundType: "solid" | "gradient" | "image";
  };
  layout: {
    headerHeight: number;
    contentPadding: number;
    borderRadius: number;
    shadowLevel: number;
  };
  content: {
    hostName: string;
    eventDate: string;
    eventTime: string;
    venue: string;
    venueAddress?: string; // Full address for map
    venueCoordinates?: {
      lat: number;
      lng: number;
    };
    dressCode?: string;
    additionalInfo?: string;
    giftInfo?: string;
    giftRegistryUrl?: string;
  };
  gallery?: {
    images: string[];
    captions?: string[];
  };
  publicUrl: string;
  uniqueToken: string; // Unique token for secure URL access
  status: "draft" | "published";
  sentCount: number;
  openedCount: number;
  respondedCount: number;
  createdAt: string;
  updatedAt: string;
}

// Claves para localStorage
const STORAGE_KEYS = {
  EVENTS: "catalina_events",
  GUESTS: "catalina_guests",
  TEMPLATES: "catalina_templates",
  INVITATIONS: "catalina_invitations",
  INVITATION_TEMPLATES: "catalina_invitation_templates",
} as const;

// Utility functions for generating unique IDs and tokens
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateUniqueToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Utilidades de localStorage con manejo de errores
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
      return false;
    }
  },
};

// Funciones para manejar eventos
export const eventStorage = {
  getAll: (): Event[] => {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!data) return [];

    try {
      const events = JSON.parse(data);
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.error("Error parsing events from localStorage:", error);
      return [];
    }
  },

  save: (events: Event[]): boolean => {
    return safeLocalStorage.setItem(
      STORAGE_KEYS.EVENTS,
      JSON.stringify(events),
    );
  },

  add: (event: Omit<Event, "id" | "createdAt" | "updatedAt">): Event => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const events = eventStorage.getAll();
    events.push(newEvent);
    eventStorage.save(events);

    return newEvent;
  },

  update: (
    id: string,
    updates: Partial<Omit<Event, "id" | "createdAt">>,
  ): Event | null => {
    const events = eventStorage.getAll();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    eventStorage.save(events);
    return events[index];
  },

  remove: (id: string): boolean => {
    const events = eventStorage.getAll();
    const filteredEvents = events.filter((e) => e.id !== id);

    if (filteredEvents.length === events.length) return false;

    return eventStorage.save(filteredEvents);
  },

  getById: (id: string): Event | null => {
    const events = eventStorage.getAll();
    return events.find((e) => e.id === id) || null;
  },
};

// Funciones para manejar invitados
export const guestStorage = {
  getAll: (): Guest[] => {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.GUESTS);
    if (!data) return [];

    try {
      const guests = JSON.parse(data);
      return Array.isArray(guests) ? guests : [];
    } catch (error) {
      console.error("Error parsing guests from localStorage:", error);
      return [];
    }
  },

  save: (guests: Guest[]): boolean => {
    return safeLocalStorage.setItem(
      STORAGE_KEYS.GUESTS,
      JSON.stringify(guests),
    );
  },

  add: (guest: Omit<Guest, "id" | "createdAt" | "updatedAt">): Guest => {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const guests = guestStorage.getAll();
    guests.push(newGuest);
    guestStorage.save(guests);

    return newGuest;
  },

  update: (
    id: string,
    updates: Partial<Omit<Guest, "id" | "createdAt">>,
  ): Guest | null => {
    const guests = guestStorage.getAll();
    const index = guests.findIndex((g) => g.id === id);

    if (index === -1) return null;

    guests[index] = {
      ...guests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    guestStorage.save(guests);
    return guests[index];
  },

  remove: (id: string): boolean => {
    const guests = guestStorage.getAll();
    const filteredGuests = guests.filter((g) => g.id !== id);

    if (filteredGuests.length === guests.length) return false;

    return guestStorage.save(filteredGuests);
  },

  getByEventId: (eventId: string): Guest[] => {
    const guests = guestStorage.getAll();
    return guests.filter((g) => g.eventId === eventId);
  },
};


// Funciones para manejar invitaciones
export const invitationStorage = {
  getAll: (): Invitation[] => {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.INVITATIONS);
    if (!data) return [];

    try {
      const invitations = JSON.parse(data);
      return Array.isArray(invitations) ? invitations : [];
    } catch (error) {
      console.error("Error parsing invitations from localStorage:", error);
      return [];
    }
  },

  save: (invitations: Invitation[]): boolean => {
    return safeLocalStorage.setItem(
      STORAGE_KEYS.INVITATIONS,
      JSON.stringify(invitations),
    );
  },

  add: (invitation: Omit<Invitation, "id" | "createdAt" | "updatedAt" | "uniqueToken">): Invitation => {
    const uniqueToken = generateUniqueToken();
    const newInvitation: Invitation = {
      ...invitation,
      id: generateUniqueId(),
      uniqueToken,
      publicUrl: `/invite/${uniqueToken}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const invitations = invitationStorage.getAll();
    invitations.push(newInvitation);
    invitationStorage.save(invitations);

    return newInvitation;
  },

  update: (
    id: string,
    updates: Partial<Omit<Invitation, "id" | "createdAt">>,
  ): Invitation | null => {
    const invitations = invitationStorage.getAll();
    const index = invitations.findIndex((i) => i.id === id);

    if (index === -1) return null;

    invitations[index] = {
      ...invitations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    invitationStorage.save(invitations);
    return invitations[index];
  },

  remove: (id: string): boolean => {
    const invitations = invitationStorage.getAll();
    const filteredInvitations = invitations.filter((i) => i.id !== id);

    if (filteredInvitations.length === invitations.length) return false;

    return invitationStorage.save(filteredInvitations);
  },

  getById: (id: string): Invitation | null => {
    const invitations = invitationStorage.getAll();
    return invitations.find((i) => i.id === id) || null;
  },

  getByEventId: (eventId: string): Invitation[] => {
    const invitations = invitationStorage.getAll();
    return invitations.filter((i) => i.eventId === eventId);
  },

  getByPublicUrl: (publicUrl: string): Invitation | null => {
    const invitations = invitationStorage.getAll();
    return invitations.find((i) => i.publicUrl === publicUrl) || null;
  },

  getByToken: (token: string): Invitation | null => {
    const invitations = invitationStorage.getAll();
    return invitations.find((i) => i.uniqueToken === token) || null;
  },
};

// Funciones para manejar plantillas de invitación
export const invitationTemplateStorage = {
  getAll: (): InvitationTemplate[] => {
    const data = safeLocalStorage.getItem(STORAGE_KEYS.INVITATION_TEMPLATES);
    if (!data) return getDefaultInvitationTemplates();

    try {
      const templates = JSON.parse(data);
      return Array.isArray(templates) ? templates : getDefaultInvitationTemplates();
    } catch (error) {
      console.error("Error parsing invitation templates from localStorage:", error);
      return getDefaultInvitationTemplates();
    }
  },

  save: (templates: InvitationTemplate[]): boolean => {
    return safeLocalStorage.setItem(
      STORAGE_KEYS.INVITATION_TEMPLATES,
      JSON.stringify(templates),
    );
  },

  getByCategory: (category: "wedding" | "corporate" | "birthday"): InvitationTemplate[] => {
    const templates = invitationTemplateStorage.getAll();
    return templates.filter((t) => t.category === category);
  },

  getByType: (type: "simple" | "premium"): InvitationTemplate[] => {
    const templates = invitationTemplateStorage.getAll();
    return templates.filter((t) => t.type === type);
  },

  getById: (id: string): InvitationTemplate | null => {
    const templates = invitationTemplateStorage.getAll();
    return templates.find((t) => t.id === id) || null;
  },
};

// Plantillas por defecto
function getDefaultInvitationTemplates(): InvitationTemplate[] {
  return [
    // Wedding Templates
    {
      id: "wedding-elegant-simple",
      name: "Elegante Clásico",
      category: "wedding",
      type: "simple",
      thumbnail: "/romantic-vintage-invitation-floral-design.webp",
      styles: {
        backgroundColor: "#f8f6f0",
        textColor: "#5a4037",
        accentColor: "#d4af37",
        fontFamily: "serif",
        fontSize: "16px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 120,
        contentPadding: 32,
        borderRadius: 12,
        shadowLevel: 2,
      },
    },
    {
      id: "wedding-romantic-premium",
      name: "Romántico Floral",
      category: "wedding",
      type: "premium",
      thumbnail: "/romantic-vintage-invitation-floral-design.webp",
      styles: {
        backgroundColor: "#fdf2f8",
        textColor: "#831843",
        accentColor: "#be185d",
        fontFamily: "script",
        fontSize: "18px",
        gradientFrom: "#fdf2f8",
        gradientTo: "#fce7f3",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 150,
        contentPadding: 40,
        borderRadius: 16,
        shadowLevel: 3,
      },
    },
    // Corporate Templates
    {
      id: "corporate-modern-simple",
      name: "Moderno Empresarial",
      category: "corporate",
      type: "simple",
      thumbnail: "/modern-minimalist-invitation-clean-design.webp",
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#3b82f6",
        fontFamily: "sans-serif",
        fontSize: "16px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 100,
        contentPadding: 24,
        borderRadius: 8,
        shadowLevel: 1,
      },
    },
    {
      id: "corporate-professional-premium",
      name: "Profesional Premium",
      category: "corporate",
      type: "premium",
      thumbnail: "/elegant-classic-invitation-burgundy-cream.webp",
      styles: {
        backgroundColor: "#1e293b",
        textColor: "#f1f5f9",
        accentColor: "#f59e0b",
        fontFamily: "sans-serif",
        fontSize: "16px",
        gradientFrom: "#1e293b",
        gradientTo: "#334155",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 120,
        contentPadding: 32,
        borderRadius: 12,
        shadowLevel: 3,
      },
    },
    // Birthday Templates
    {
      id: "birthday-festive-simple",
      name: "Festivo Simple",
      category: "birthday",
      type: "simple",
      thumbnail: "/festive-colorful-invitation-celebration.webp",
      styles: {
        backgroundColor: "#fef3c7",
        textColor: "#92400e",
        accentColor: "#f59e0b",
        fontFamily: "sans-serif",
        fontSize: "16px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 110,
        contentPadding: 28,
        borderRadius: 10,
        shadowLevel: 2,
      },
    },
    {
      id: "birthday-colorful-premium",
      name: "Colorido Premium",
      category: "birthday",
      type: "premium",
      thumbnail: "/festive-colorful-invitation-celebration.webp",
      styles: {
        backgroundColor: "#a855f7",
        textColor: "#ffffff",
        accentColor: "#fbbf24",
        fontFamily: "sans-serif",
        fontSize: "18px",
        gradientFrom: "#a855f7",
        gradientTo: "#ec4899",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 140,
        contentPadding: 36,
        borderRadius: 16,
        shadowLevel: 3,
      },
    },
    // Additional Simple Templates - More Visual Variety
    {
      id: "wedding-garden-simple",
      name: "Jardín Natural",
      category: "wedding",
      type: "simple",
      thumbnail: "/garden-natural-invitation.png",
      styles: {
        backgroundColor: "#f0f9f0",
        textColor: "#1f4d1f",
        accentColor: "#16a34a",
        fontFamily: "sans-serif",
        fontSize: "16px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 130,
        contentPadding: 36,
        borderRadius: 18,
        shadowLevel: 2,
      },
    },
    {
      id: "wedding-vintage-simple",
      name: "Vintage Retro",
      category: "wedding",
      type: "simple",
      thumbnail: "/vintage-retro-invitation.png",
      styles: {
        backgroundColor: "#fef7ed",
        textColor: "#7c2d12",
        accentColor: "#ea580c",
        fontFamily: "serif",
        fontSize: "17px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 125,
        contentPadding: 30,
        borderRadius: 20,
        shadowLevel: 3,
      },
    },
    {
      id: "corporate-tech-simple",
      name: "Tech Innovador",
      category: "corporate",
      type: "simple",
      thumbnail: "/tech-innovative-invitation.png",
      styles: {
        backgroundColor: "#f1f5f9",
        textColor: "#0f172a",
        accentColor: "#06b6d4",
        fontFamily: "sans-serif",
        fontSize: "15px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 95,
        contentPadding: 26,
        borderRadius: 6,
        shadowLevel: 1,
      },
    },
    // Premium Landing Page Templates - Modern Digital Invitations
    {
      id: "premium-elegant-landing",
      name: "Elegante Landing Page",
      category: "wedding",
      type: "premium",
      thumbnail: "/elegant-landing-preview.png",
      styles: {
        backgroundColor: "#F5F1E8",
        textColor: "#4A4A4A",
        accentColor: "#D4AF37",
        fontFamily: "serif",
        fontSize: "18px",
        gradientFrom: "#F5F1E8",
        gradientTo: "#E8DCC6",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 200,
        contentPadding: 0, // Full page layout
        borderRadius: 0,
        shadowLevel: 0,
      },
      features: ["Hero Section", "Event Timeline", "Menu Display", "RSVP Form", "Thank You Section", "Floating Navigation", "Smooth Scrolling", "Responsive Design"]
    },
    {
      id: "premium-modern-landing",
      name: "Moderno Landing Page",
      category: "corporate",
      type: "premium",
      thumbnail: "/modern-landing-preview.png",
      styles: {
        backgroundColor: "#F1F5F9",
        textColor: "#334155",
        accentColor: "#3B82F6",
        fontFamily: "sans-serif",
        fontSize: "16px",
        gradientFrom: "#F1F5F9",
        gradientTo: "#E2E8F0",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 200,
        contentPadding: 0,
        borderRadius: 0,
        shadowLevel: 0,
      },
      features: ["Corporate Design", "Professional Layout", "Business Timeline", "Catering Menu", "Professional RSVP", "Modern Navigation", "Clean Typography", "Mobile Optimized"]
    },
    {
      id: "premium-romantic-landing",
      name: "Romántico Landing Page",
      category: "wedding",
      type: "premium",
      thumbnail: "/romantic-landing-preview.png",
      styles: {
        backgroundColor: "#FDF2F8",
        textColor: "#831843",
        accentColor: "#EC4899",
        fontFamily: "script",
        fontSize: "18px",
        gradientFrom: "#FDF2F8",
        gradientTo: "#FCE7F3",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 200,
        contentPadding: 0,
        borderRadius: 0,
        shadowLevel: 0,
      },
      features: ["Romantic Design", "Love Story Timeline", "Wedding Menu", "Elegant RSVP", "Heartfelt Messages", "Smooth Animations", "Romantic Icons", "Photo Integration"]
    },
    {
      id: "premium-celebration-landing",
      name: "Celebración Landing Page",
      category: "birthday",
      type: "premium",
      thumbnail: "/celebration-landing-preview.png",
      styles: {
        backgroundColor: "#FEF3C7",
        textColor: "#92400E",
        accentColor: "#F59E0B",
        fontFamily: "sans-serif",
        fontSize: "17px",
        gradientFrom: "#FEF3C7",
        gradientTo: "#FDE68A",
        backgroundType: "gradient",
      },
      layout: {
        headerHeight: 200,
        contentPadding: 0,
        borderRadius: 0,
        shadowLevel: 0,
      },
      features: ["Festive Design", "Party Timeline", "Birthday Menu", "Fun RSVP", "Celebration Mood", "Colorful Layout", "Party Icons", "Gift Registry"]
    },
    {
      id: "corporate-luxury-simple",
      name: "Lujo Ejecutivo",
      category: "corporate",
      type: "simple",
      thumbnail: "/luxury-executive-invitation.png",
      styles: {
        backgroundColor: "#1f1f23",
        textColor: "#d4d4d8",
        accentColor: "#fbbf24",
        fontFamily: "serif",
        fontSize: "16px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 115,
        contentPadding: 32,
        borderRadius: 12,
        shadowLevel: 4,
      },
    },
    {
      id: "birthday-tropical-simple",
      name: "Tropical Vibrante",
      category: "birthday",
      type: "simple",
      thumbnail: "/tropical-vibrant-invitation.png",
      styles: {
        backgroundColor: "#fef3c7",
        textColor: "#0f766e",
        accentColor: "#14b8a6",
        fontFamily: "sans-serif",
        fontSize: "17px",
        backgroundType: "solid",
      },
      layout: {
        headerHeight: 135,
        contentPadding: 34,
        borderRadius: 22,
        shadowLevel: 2,
      },
    },
  ];
}

// Datos por defecto para tipos de invitación
export const getInvitationTypes = (): InvitationType[] => [
  {
    id: "simple",
    name: "Simple",
    description: "Invitaciones con plantillas visuales variadas y CTA WhatsApp",
    features: [
      "Plantillas visuales variadas por categoría",
      "Diseños atractivos preconfigurados",
      "CTA con WhatsApp Business API",
      "URL pública personalizada",
      "Vista previa inmediata",
    ],
    price: "Incluido",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Editor avanzado con formulario embebido y funciones completas",
    features: [
      "Editor visual completo y avanzado",
      "Formulario embebido en preview",
      "URL funcional de ejemplo",
      "Subida de imágenes personalizadas",
      "Gradientes y efectos premium",
      "Estadísticas detalladas",
    ],
    price: "Plan Avanzado",
  },
];

// Utilidad para limpiar todos los datos
export const clearAllData = (): boolean => {
  try {
    safeLocalStorage.removeItem(STORAGE_KEYS.EVENTS);
    safeLocalStorage.removeItem(STORAGE_KEYS.GUESTS);
    safeLocalStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    safeLocalStorage.removeItem(STORAGE_KEYS.INVITATIONS);
    safeLocalStorage.removeItem(STORAGE_KEYS.INVITATION_TEMPLATES);
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
};

// Utilidad para exportar todos los datos
export const exportData = () => {
  const data = {
    events: eventStorage.getAll(),
    guests: guestStorage.getAll(),
    exportedAt: new Date().toISOString(),
  };

  return data;
};

// Utilidad para importar datos
export const importData = (data: {
  events?: Event[];
  guests?: Guest[];
}): boolean => {
  try {
    if (data.events && Array.isArray(data.events)) {
      eventStorage.save(data.events);
    }

    if (data.guests && Array.isArray(data.guests)) {
      guestStorage.save(data.guests);
    }

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

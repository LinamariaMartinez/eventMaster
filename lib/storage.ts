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
    dressCode?: string;
    additionalInfo?: string;
  };
  publicUrl: string;
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
    if (!data) return getDefaultEvents();

    try {
      const events = JSON.parse(data);
      return Array.isArray(events) ? events : getDefaultEvents();
    } catch (error) {
      console.error("Error parsing events from localStorage:", error);
      return getDefaultEvents();
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

// Datos por defecto para demo - Eventos colombianos realistas
function getDefaultEvents(): Event[] {
  return [
    {
      id: "1",
      title: "Gala de la Independencia 2025",
      description:
        "Celebración del Día de la Independencia con cena de gala, orquesta en vivo y reconocimientos a empresarios destacados del año",
      date: "2025-07-20",
      time: "19:00",
      location: "Hotel Tequendama, Salón Bolívar - Bogotá",
      maxGuests: 120,
      confirmedGuests: 85,
      status: "published",
      createdAt: "2025-06-01T10:00:00.000Z",
      updatedAt: "2025-06-15T14:30:00.000Z",
    },
    {
      id: "2",
      title: "Feria de Flores y Networking",
      description: "Evento de networking empresarial durante la temporada de la Feria de las Flores, con degustación de café colombiano",
      date: "2025-08-08",
      time: "16:00",
      location: "Plaza Mayor, Pabellón Amarillo - Medellín",
      maxGuests: 80,
      confirmedGuests: 62,
      status: "published",
      createdAt: "2025-07-01T09:00:00.000Z",
      updatedAt: "2025-07-20T11:15:00.000Z",
    },
    {
      id: "3",
      title: "Conferencia Café y Tecnología",
      description: "Simposio internacional sobre innovación en la industria cafetera colombiana y nuevas tecnologías agrícolas",
      date: "2025-09-15",
      time: "08:30",
      location: "Centro de Convenciones Corferias - Bogotá",
      maxGuests: 250,
      confirmedGuests: 180,
      status: "published",
      createdAt: "2025-08-01T08:00:00.000Z",
      updatedAt: "2025-08-25T16:45:00.000Z",
    },
    {
      id: "4",
      title: "Noche de Salsa y Emprendimiento",
      description: "Encuentro de emprendedores caleños con show de salsa, presentación de startups y premios al mejor proyecto",
      date: "2025-10-12",
      time: "20:00",
      location: "Hotel Intercontinental, Terraza Panorámica - Cali",
      maxGuests: 150,
      confirmedGuests: 95,
      status: "draft",
      createdAt: "2025-09-01T12:00:00.000Z",
      updatedAt: "2025-09-15T18:20:00.000Z",
    },
    {
      id: "5", 
      title: "Festival Gastronómico Caribe",
      description: "Degustación de platos típicos del Caribe colombiano con chefs invitados de Cartagena y Barranquilla",
      date: "2025-11-28",
      time: "18:30",
      location: "Centro Histórico, Plaza Santo Domingo - Cartagena",
      maxGuests: 100,
      confirmedGuests: 72,
      status: "draft",
      createdAt: "2025-10-01T15:30:00.000Z",
      updatedAt: "2025-10-18T10:45:00.000Z",
    },
  ];
}

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

  add: (invitation: Omit<Invitation, "id" | "createdAt" | "updatedAt">): Invitation => {
    const newInvitation: Invitation = {
      ...invitation,
      id: Date.now().toString(),
      publicUrl: `/invitation/${Date.now().toString()}`,
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
      thumbnail: "/romantic-vintage-invitation-floral-design.png",
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
      thumbnail: "/romantic-vintage-invitation-floral-design.png",
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
      thumbnail: "/modern-minimalist-invitation-clean-design.png",
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
      thumbnail: "/elegant-classic-invitation-burgundy-cream.png",
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
      thumbnail: "/festive-colorful-invitation-celebration.png",
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
      thumbnail: "/festive-colorful-invitation-celebration.png",
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
  ];
}

// Datos por defecto para tipos de invitación
export const getInvitationTypes = (): InvitationType[] => [
  {
    id: "simple",
    name: "Simple",
    description: "Invitaciones básicas con diseño limpio y funcional",
    features: [
      "Diseño simple y elegante",
      "3 plantillas por categoría",
      "Colores y fuentes básicos",
      "URL pública personalizada",
      "Formulario RSVP básico",
    ],
    price: "Gratis",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Invitaciones avanzadas con funciones premium",
    features: [
      "Diseños premium con gradientes",
      "Editor visual avanzado",
      "Subida de imágenes personalizadas",
      "Animaciones y efectos",
      "Formulario RSVP avanzado",
      "Estadísticas detalladas",
    ],
    price: "$9.99/mes",
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

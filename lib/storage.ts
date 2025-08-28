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
  createdAt: string;
  updatedAt: string;
}

// Claves para localStorage
const STORAGE_KEYS = {
  EVENTS: 'catalina_events',
  GUESTS: 'catalina_guests',
  TEMPLATES: 'catalina_templates',
} as const;

// Utilidades de localStorage con manejo de errores
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
      return false;
    }
  }
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
      console.error('Error parsing events from localStorage:', error);
      return getDefaultEvents();
    }
  },
  
  save: (events: Event[]): boolean => {
    return safeLocalStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },
  
  add: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event => {
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
  
  update: (id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Event | null => {
    const events = eventStorage.getAll();
    const index = events.findIndex(e => e.id === id);
    
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
    const filteredEvents = events.filter(e => e.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    return eventStorage.save(filteredEvents);
  },
  
  getById: (id: string): Event | null => {
    const events = eventStorage.getAll();
    return events.find(e => e.id === id) || null;
  }
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
      console.error('Error parsing guests from localStorage:', error);
      return [];
    }
  },
  
  save: (guests: Guest[]): boolean => {
    return safeLocalStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  },
  
  add: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Guest => {
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
  
  update: (id: string, updates: Partial<Omit<Guest, 'id' | 'createdAt'>>): Guest | null => {
    const guests = guestStorage.getAll();
    const index = guests.findIndex(g => g.id === id);
    
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
    const filteredGuests = guests.filter(g => g.id !== id);
    
    if (filteredGuests.length === guests.length) return false;
    
    return guestStorage.save(filteredGuests);
  },
  
  getByEventId: (eventId: string): Guest[] => {
    const guests = guestStorage.getAll();
    return guests.filter(g => g.eventId === eventId);
  }
};

// Datos por defecto para demo
function getDefaultEvents(): Event[] {
  return [
    {
      id: "1",
      title: "Conferencia Anual 2024",
      description: "Conferencia anual de la empresa con presentaciones y networking",
      date: "2024-12-15",
      time: "09:00",
      location: "Centro de Convenciones",
      maxGuests: 100,
      confirmedGuests: 45,
      status: "published",
      createdAt: "2024-11-01T10:00:00.000Z",
      updatedAt: "2024-11-01T10:00:00.000Z",
    },
    {
      id: "2",
      title: "Reunión de Equipo",
      description: "Reunión mensual del equipo de desarrollo",
      date: "2024-12-18",
      time: "14:00",
      location: "Sala de Juntas A",
      maxGuests: 15,
      confirmedGuests: 12,
      status: "published",
      createdAt: "2024-11-01T11:00:00.000Z",
      updatedAt: "2024-11-01T11:00:00.000Z",
    },
    {
      id: "3",
      title: "Celebración Navideña",
      description: "Fiesta navideña de la empresa",
      date: "2024-12-22",
      time: "18:00",
      location: "Salón Principal",
      maxGuests: 100,
      confirmedGuests: 78,
      status: "draft",
      createdAt: "2024-11-01T12:00:00.000Z",
      updatedAt: "2024-11-01T12:00:00.000Z",
    },
  ];
}

// Utilidad para limpiar todos los datos
export const clearAllData = (): boolean => {
  try {
    safeLocalStorage.removeItem(STORAGE_KEYS.EVENTS);
    safeLocalStorage.removeItem(STORAGE_KEYS.GUESTS);
    safeLocalStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
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
export const importData = (data: { events?: Event[], guests?: Guest[] }): boolean => {
  try {
    if (data.events && Array.isArray(data.events)) {
      eventStorage.save(data.events);
    }
    
    if (data.guests && Array.isArray(data.guests)) {
      guestStorage.save(data.guests);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
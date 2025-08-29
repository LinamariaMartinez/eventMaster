"use client";

import { useState, useEffect, useCallback } from "react";
import { eventStorage, type Event } from "@/lib/storage";

export interface UseEventsStorageReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => Event;
  updateEvent: (id: string, updates: Partial<Omit<Event, "id" | "createdAt">>) => Event | null;
  removeEvent: (id: string) => boolean;
  getEvent: (id: string) => Event | null;
  refreshEvents: () => void;
}

export function useEventsStorage(): UseEventsStorageReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const loadedEvents = eventStorage.getAll();
      setEvents(loadedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback((eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newEvent = eventStorage.add(eventData);
      setEvents(current => [...current, newEvent]);
      setError(null);
      return newEvent;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error adding event";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Omit<Event, "id" | "createdAt">>) => {
    try {
      const updatedEvent = eventStorage.update(id, updates);
      if (updatedEvent) {
        setEvents(current => 
          current.map(event => event.id === id ? updatedEvent : event)
        );
        setError(null);
      }
      return updatedEvent;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error updating event";
      setError(errorMsg);
      return null;
    }
  }, []);

  const removeEvent = useCallback((id: string) => {
    try {
      const success = eventStorage.remove(id);
      if (success) {
        setEvents(current => current.filter(event => event.id !== id));
        setError(null);
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error removing event";
      setError(errorMsg);
      return false;
    }
  }, []);

  const getEvent = useCallback((id: string) => {
    try {
      return eventStorage.getById(id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error getting event";
      setError(errorMsg);
      return null;
    }
  }, []);

  const refreshEvents = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    removeEvent,
    getEvent,
    refreshEvents,
  };
}
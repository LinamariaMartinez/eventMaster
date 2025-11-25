"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient, validateSupabaseConnection } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database.types";
import { toast } from "sonner";

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

export interface UseSupabaseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  addEvent: (event: Omit<EventInsert, 'user_id' | 'public_url'>) => Promise<Event | null>;
  updateEvent: (id: string, updates: EventUpdate) => Promise<Event | null>;
  removeEvent: (id: string) => Promise<boolean>;
  getEvent: (id: string) => Event | null;
  refreshEvents: () => Promise<void>;
}

export function useSupabaseEvents(): UseSupabaseEventsReturn {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      console.log('[use-supabase-events] Starting loadEvents...');
      setLoading(true);
      setError(null);
      
      console.log('[use-supabase-events] Auth state:', { isAuthenticated, userId: user?.id, userEmail: user?.email });
      
      if (!isAuthenticated || !user) {
        console.log('[use-supabase-events] No authenticated user, setting empty events list');
        setEvents([]);
        setLoading(false);
        return;
      }
      
      // Validate user ID is a proper UUID
      if (!user.id || typeof user.id !== 'string' || user.id.length !== 36) {
        const error = `Invalid user ID format: ${user.id}. Expected valid UUID.`;
        console.error('[use-supabase-events] UUID validation failed:', {
          userId: user.id,
          userIdType: typeof user.id,
          userIdLength: user.id?.length
        });
        throw new Error(error);
      }
      
      console.log('[use-supabase-events] Validating Supabase connection...');
      
      // First validate the connection
      const connectionStatus = await validateSupabaseConnection();
      console.log('[use-supabase-events] Connection status:', connectionStatus);
      
      if (!connectionStatus.isConnected) {
        throw new Error(`Supabase connection failed: ${connectionStatus.error}`);
      }
      
      console.log('[use-supabase-events] Creating Supabase client...');
      const supabase = createClient();
      
      // Additional session validation
      try {
        console.log('[use-supabase-events] Checking session consistency...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('[use-supabase-events] Session error (non-fatal):', sessionError);
        }
        
        console.log('[use-supabase-events] Session status:', {
          hasSession: !!session,
          sessionUserId: session?.user?.id,
          sessionUserEmail: session?.user?.email,
          sessionValid: session && !sessionError
        });
        
      } catch (sessionErr) {
        console.warn('[use-supabase-events] Session check failed (non-fatal):', sessionErr);
      }

      console.log('[use-supabase-events] Fetching events for user:', user.id);
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('[use-supabase-events] Query result:', {
        dataCount: data?.length || 0,
        hasError: !!fetchError,
        errorDetails: fetchError ? {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        } : null
      });

      if (fetchError) {
        console.error('[use-supabase-events] Fetch error details:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          fullError: fetchError
        });
        throw fetchError;
      }

      console.log('[use-supabase-events] Successfully loaded', data?.length || 0, 'events');
      setEvents(data || []);
    } catch (err) {
      const errorDetails = {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      };
      
      console.error('[use-supabase-events] Error loading events:', errorDetails);
      
      const errorMsg = err instanceof Error ? err.message : "Error loading events";
      setError(`Failed to load events: ${errorMsg}`);
      setEvents([]);
      
      // Add toast notification for user feedback
      toast.error(`Error al cargar eventos: ${errorMsg}`);
    } finally {
      setLoading(false);
      console.log('[use-supabase-events] loadEvents completed');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(async (eventData: Omit<EventInsert, 'user_id' | 'public_url'>) => {
    try {
      console.log('[use-supabase-events] Starting addEvent...', { eventTitle: eventData.title });
      console.log('[use-supabase-events] Auth context:', {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        userObject: user
      });

      if (!isAuthenticated || !user) {
        const error = "No authenticated user";
        console.error('[use-supabase-events] AddEvent failed:', error);
        throw new Error(error);
      }

      // Validate user ID is a proper UUID (strict check)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!user.id || typeof user.id !== 'string' || !uuidRegex.test(user.id)) {
        const error = `Invalid user ID format for event creation: "${user.id}". Expected valid UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).`;
        console.error('[use-supabase-events] UUID validation failed for addEvent:', {
          userId: user.id,
          userIdType: typeof user.id,
          userIdLength: user.id?.length,
          passesRegex: uuidRegex.test(user.id || ''),
          fullUser: user
        });
        throw new Error(error);
      }

      console.log('[use-supabase-events] Creating event for user:', user.id);
      const supabase = createClient();

      // Generate a unique public URL
      const eventId = crypto.randomUUID();
      const publicUrl = `/invite/${eventId}`;
      
      console.log('[use-supabase-events] Generated event ID and URL:', { eventId, publicUrl });

      const insertData: EventInsert = {
        id: eventId,
        user_id: user.id,
        public_url: publicUrl,
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        description: eventData.description || null,
        template_id: eventData.template_id || null,
        settings: eventData.settings,
        whatsapp_number: eventData.whatsapp_number || null,
      };

      console.log('📞 WhatsApp number in insertData:', insertData.whatsapp_number);

      console.log('[use-supabase-events] Inserting event data:', insertData);

      // Type workaround: Supabase v2 has type inference issues with .insert()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase.from('events').insert as any)(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('[use-supabase-events] Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          fullError: insertError
        });

        // Log additional context
        console.error('[use-supabase-events] Failed insert data was:', insertData);
        console.error('[use-supabase-events] User context:', { userId: user.id, email: user.email });

        const errorMsg = insertError.message || insertError.hint || 'Unknown database error';
        throw new Error(`Database error: ${errorMsg}`);
      }

      if (!data) {
        console.error('[use-supabase-events] Insert succeeded but returned no data');
        throw new Error('Insert succeeded but returned no data');
      }

      console.log('[use-supabase-events] Event created successfully:', data.id);
      setEvents(current => [data, ...current]);
      setError(null);
      return data;
    } catch (err) {
      const errorDetails = {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      };
      
      console.error('[use-supabase-events] Error adding event:', errorDetails);
      
      const errorMsg = err instanceof Error ? err.message : "Error adding event";
      setError(`Failed to add event: ${errorMsg}`);
      toast.error(`Error al crear evento: ${errorMsg}`);
      return null;
    }
  }, [isAuthenticated, user]);

  const updateEvent = useCallback(async (id: string, updates: EventUpdate) => {
    try {
      const supabase = createClient();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase.from('events').update as any)(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setEvents(current => 
        current.map(event => event.id === id ? data : event)
      );
      setError(null);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error updating event";
      setError(errorMsg);
      toast.error(`Error al actualizar evento: ${errorMsg}`);
      return null;
    }
  }, []);

  const removeEvent = useCallback(async (id: string) => {
    try {
      const supabase = createClient();
      
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setEvents(current => current.filter(event => event.id !== id));
      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error removing event";
      setError(errorMsg);
      toast.error(`Error al eliminar evento: ${errorMsg}`);
      return false;
    }
  }, []);

  const getEvent = useCallback((id: string) => {
    return events.find(event => event.id === id) || null;
  }, [events]);

  const refreshEvents = useCallback(async () => {
    await loadEvents();
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
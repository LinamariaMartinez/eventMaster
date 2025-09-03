"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient, validateSupabaseConnection } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database.types";
import { toast } from "sonner";

type Guest = Database['public']['Tables']['guests']['Row'];
type GuestInsert = Database['public']['Tables']['guests']['Insert'];
type GuestUpdate = Database['public']['Tables']['guests']['Update'];

export interface UseSupabaseGuestsReturn {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  addGuest: (guest: GuestInsert) => Promise<Guest | null>;
  updateGuest: (id: string, updates: GuestUpdate) => Promise<Guest | null>;
  removeGuest: (id: string) => Promise<boolean>;
  getGuestsByEvent: (eventId: string) => Guest[];
  refreshGuests: () => Promise<void>;
}

export function useSupabaseGuests(): UseSupabaseGuestsReturn {
  const { user, isAuthenticated } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGuests = useCallback(async () => {
    try {
      console.log('[use-supabase-guests] Starting loadGuests...');
      setLoading(true);
      setError(null);
      
      console.log('[use-supabase-guests] Auth state:', { isAuthenticated, userId: user?.id, userEmail: user?.email });
      
      if (!isAuthenticated || !user) {
        console.log('[use-supabase-guests] No authenticated user, setting empty guests list');
        setGuests([]);
        setLoading(false);
        return;
      }
      
      // Validate user ID is a proper UUID
      if (!user.id || typeof user.id !== 'string' || user.id.length !== 36) {
        const error = `Invalid user ID format: ${user.id}. Expected valid UUID.`;
        console.error('[use-supabase-guests] UUID validation failed:', {
          userId: user.id,
          userIdType: typeof user.id,
          userIdLength: user.id?.length
        });
        throw new Error(error);
      }
      
      console.log('[use-supabase-guests] Validating Supabase connection...');
      
      // First validate the connection
      const connectionStatus = await validateSupabaseConnection();
      console.log('[use-supabase-guests] Connection status:', connectionStatus);
      
      if (!connectionStatus.isConnected) {
        throw new Error(`Supabase connection failed: ${connectionStatus.error}`);
      }
      
      console.log('[use-supabase-guests] Creating Supabase client...');
      const supabase = createClient();
      
      // Additional session validation
      try {
        console.log('[use-supabase-guests] Checking session consistency...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('[use-supabase-guests] Session error (non-fatal):', sessionError);
        }
        
        console.log('[use-supabase-guests] Session status:', {
          hasSession: !!session,
          sessionUserId: session?.user?.id,
          sessionUserEmail: session?.user?.email,
          sessionValid: session && !sessionError
        });
        
      } catch (sessionErr) {
        console.warn('[use-supabase-guests] Session check failed (non-fatal):', sessionErr);
      }

      console.log('[use-supabase-guests] Fetching guests for user events:', user.id);
      
      // Load guests for all events owned by the user
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select(`
          *,
          events!inner(
            id,
            title,
            user_id
          )
        `)
        .eq('events.user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('[use-supabase-guests] Query result:', {
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
        console.error('[use-supabase-guests] Fetch error details:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          fullError: fetchError
        });
        throw fetchError;
      }

      console.log('[use-supabase-guests] Successfully loaded', data?.length || 0, 'guests');
      setGuests(data || []);
    } catch (err) {
      const errorDetails = {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      };
      
      console.error('[use-supabase-guests] Error loading guests:', errorDetails);
      
      const errorMsg = err instanceof Error ? err.message : "Error loading guests";
      setError(`Failed to load guests: ${errorMsg}`);
      setGuests([]); // Set empty guests on error
      
      // Add toast notification for user feedback
      toast.error(`Error al cargar invitados: ${errorMsg}`);
    } finally {
      setLoading(false);
      console.log('[use-supabase-guests] loadGuests completed');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const addGuest = useCallback(async (guestData: GuestInsert) => {
    try {
      console.log('[use-supabase-guests] Starting addGuest...', { guestName: guestData.name, eventId: guestData.event_id });
      
      const supabase = createClient();
      
      console.log('[use-supabase-guests] Inserting guest data:', guestData);
      
      const { data, error: insertError } = await supabase
        .from('guests')
        .insert(guestData)
        .select()
        .single();

      if (insertError) {
        console.error('[use-supabase-guests] Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          fullError: insertError
        });
        throw insertError;
      }

      console.log('[use-supabase-guests] Guest added successfully:', data.id);
      setGuests(current => [data, ...current]);
      setError(null);
      return data;
    } catch (err) {
      const errorDetails = {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      };
      
      console.error('[use-supabase-guests] Error adding guest:', errorDetails);
      
      const errorMsg = err instanceof Error ? err.message : "Error adding guest";
      setError(`Failed to add guest: ${errorMsg}`);
      toast.error(`Error al añadir invitado: ${errorMsg}`);
      return null;
    }
  }, []);

  const updateGuest = useCallback(async (id: string, updates: GuestUpdate) => {
    try {
      const supabase = createClient();
      
      const { data, error: updateError } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          events(
            id,
            title,
            date,
            time,
            location
          )
        `)
        .single();

      if (updateError) {
        throw updateError;
      }

      // If guest status is being updated to 'confirmed', sync with Google Sheets
      if (updates.status === 'confirmed' && data) {
        try {
          console.log('[use-supabase-guests] Syncing confirmed guest with Google Sheets:', data.name);
          
          const response = await fetch('/api/google-sheets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'confirm_guest',
              guestData: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                status: data.status,
                guest_count: data.guest_count,
                dietary_restrictions: data.dietary_restrictions,
                message: data.message,
              },
              eventData: (data as unknown as { events: { id: string; title: string; date: string; time: string; location: string } }).events
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('[use-supabase-guests] Successfully synced with Google Sheets:', result.message);
            toast.success('Invitado confirmado y sincronizado con Google Sheets');
          } else {
            console.warn('[use-supabase-guests] Failed to sync with Google Sheets:', response.statusText);
            toast.warning('Invitado confirmado, pero no se pudo sincronizar con Google Sheets');
          }
        } catch (syncError) {
          console.warn('[use-supabase-guests] Google Sheets sync error:', syncError);
          toast.warning('Invitado confirmado, pero no se pudo sincronizar con Google Sheets');
        }
      }

      setGuests(current => 
        current.map(guest => guest.id === id ? data : guest)
      );
      setError(null);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error updating guest";
      setError(errorMsg);
      toast.error(`Error al actualizar invitado: ${errorMsg}`);
      return null;
    }
  }, []);

  const removeGuest = useCallback(async (id: string) => {
    try {
      const supabase = createClient();
      
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setGuests(current => current.filter(guest => guest.id !== id));
      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error removing guest";
      setError(errorMsg);
      toast.error(`Error al eliminar invitado: ${errorMsg}`);
      return false;
    }
  }, []);

  const getGuestsByEvent = useCallback((eventId: string) => {
    return guests.filter(guest => guest.event_id === eventId);
  }, [guests]);

  const refreshGuests = useCallback(async () => {
    await loadGuests();
  }, [loadGuests]);

  return {
    guests,
    loading,
    error,
    addGuest,
    updateGuest,
    removeGuest,
    getGuestsByEvent,
    refreshGuests,
  };
}
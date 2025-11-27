"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export interface EventViewStats {
  event_id: string;
  total_views: number;
  views_today: number;
  views_this_week: number;
  unique_visitors: number;
}

export interface UseInvitationViewsReturn {
  viewStats: Record<string, EventViewStats>;
  loading: boolean;
  error: string | null;
  refreshViewStats: () => Promise<void>;
  getEventViews: (eventId: string) => EventViewStats | null;
}

export function useInvitationViews(): UseInvitationViewsReturn {
  const { user, isAuthenticated } = useAuth();
  const [viewStats, setViewStats] = useState<Record<string, EventViewStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadViewStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !user) {
        setViewStats({});
        setLoading(false);
        return;
      }

      const supabase = createClient();

      // Get all events owned by the user
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', user.id);

      if (eventsError) {
        throw eventsError;
      }

      if (!userEvents || userEvents.length === 0) {
        setViewStats({});
        setLoading(false);
        return;
      }

      const eventIds = userEvents.map(e => e.id);

      // Get all views for user's events
      const { data: views, error: viewsError } = await supabase
        .from('invitation_views')
        .select('event_id, viewed_at, ip_hash')
        .in('event_id', eventIds);

      if (viewsError) {
        throw viewsError;
      }

      // Calculate stats for each event
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: Record<string, EventViewStats> = {};

      eventIds.forEach(eventId => {
        const eventViews = views?.filter(v => v.event_id === eventId) || [];
        const uniqueIPs = new Set(eventViews.map(v => v.ip_hash));

        stats[eventId] = {
          event_id: eventId,
          total_views: eventViews.length,
          views_today: eventViews.filter(v => new Date(v.viewed_at) >= todayStart).length,
          views_this_week: eventViews.filter(v => new Date(v.viewed_at) >= weekStart).length,
          unique_visitors: uniqueIPs.size,
        };
      });

      setViewStats(stats);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading view stats";
      setError(errorMsg);
      console.error('[use-invitation-views] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadViewStats();
  }, [loadViewStats]);

  const getEventViews = useCallback((eventId: string) => {
    return viewStats[eventId] || null;
  }, [viewStats]);

  const refreshViewStats = useCallback(async () => {
    await loadViewStats();
  }, [loadViewStats]);

  return {
    viewStats,
    loading,
    error,
    refreshViewStats,
    getEventViews,
  };
}

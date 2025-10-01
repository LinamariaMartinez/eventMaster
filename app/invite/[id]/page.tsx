"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { createDefaultConfig } from "@/types/invitation-blocks";
import type { Database } from "@/types/database.types";
import type {
  InvitationConfig,
  EventType,
  TimelineBlockData,
  LocationBlockData,
  MenuBlockData,
  RsvpBlockData,
  HeroBlockData,
} from "@/types/invitation-blocks";

type Event = Database['public']['Tables']['events']['Row'];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper to parse event.settings as InvitationConfig
function parseInvitationConfig(
  event: Event
): { config: InvitationConfig; blockData: Record<string, unknown> } | null {
  try {
    const settings = event.settings as Record<string, unknown>;

    // Check if event has new block-based config
    if (settings && typeof settings === 'object' && 'eventType' in settings) {
      return {
        config: settings as InvitationConfig,
        blockData: (settings as { blockData?: Record<string, unknown> }).blockData || {},
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing invitation config:', error);
    return null;
  }
}

export default function InvitationPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState<string | null>(null);

  // Resolve params Promise
  useEffect(() => {
    params.then(p => setEventId(p.id));
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const loadEventData = async () => {
      try {
        const supabase = createClient();

        const { data: eventData, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error || !eventData) {
          setNotFound(true);
          return;
        }

        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p>Cargando invitación...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invitación No Encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Esta invitación no existe o ha sido eliminada.
            </p>
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse invitation config from event.settings
  const parsed = parseInvitationConfig(event);

  if (parsed) {
    // NEW: Use block-based renderer
    const { config, blockData } = parsed;

    return (
      <InvitationRenderer
        event={event}
        config={config}
        blockData={blockData as {
          hero?: HeroBlockData;
          timeline?: TimelineBlockData;
          location?: LocationBlockData;
          menu?: MenuBlockData;
          rsvp?: RsvpBlockData;
        }}
      />
    );
  }

  // FALLBACK: Use default wedding config if no config found
  const defaultConfig = createDefaultConfig('wedding' as EventType);

  return (
    <InvitationRenderer
      event={event}
      config={defaultConfig}
      blockData={{
        hero: {
          title: event.title,
          subtitle: event.description || undefined,
          showCountdown: true,
        },
        location: {
          address: event.location,
        },
        rsvp: {
          allowPlusOnes: true,
          maxGuestsPerInvite: 5,
        },
      }}
    />
  );
}

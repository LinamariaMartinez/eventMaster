import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

// Helper to extract hero image from event settings
function getHeroImage(event: Event): string | null {
  try {
    const settings = event.settings as Record<string, unknown>;
    if (settings && typeof settings === "object") {
      const blockContent = settings.blockContent as Record<string, unknown>;
      if (blockContent && typeof blockContent === "object") {
        const hero = blockContent.hero as Record<string, unknown>;
        if (hero && typeof hero === "object" && typeof hero.backgroundImage === "string") {
          return hero.backgroundImage;
        }
      }
    }
  } catch (error) {
    console.error("Error extracting hero image:", error);
  }
  return null;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch event data
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", resolvedParams.id)
    .single<Event>();

  if (error || !event) {
    return {
      title: "Invitación no encontrada",
      description: "Esta invitación no existe o ha sido eliminada.",
    };
  }

  // Extract hero image
  const heroImage = getHeroImage(event);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // Use existing elegant image as fallback (or replace with og-default.jpg when available)
  const ogImage = heroImage || `${appUrl}/elegant-classic-invitation-burgundy-cream.webp`;

  // Format date for description
  const eventDate = new Date(event.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const description =
    event.description ||
    `Estás invitado/a a ${event.title} el ${eventDate} en ${event.location}`;

  return {
    title: event.title,
    description: description,
    openGraph: {
      title: event.title,
      description: description,
      type: "website",
      url: `${appUrl}/invite/${resolvedParams.id}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      locale: "es_ES",
      siteName: "Catalina Lezama Eventos",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: description,
      images: [ogImage],
    },
  };
}

export default function InviteLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

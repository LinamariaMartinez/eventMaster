"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventForm } from "@/components/dashboard/events/event-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EventFormData } from "@/types";
import { toast } from "sonner";
import { eventStorage } from "@/lib/storage";

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock templates data - vendría de la API
  const templates = [
    {
      id: "1",
      name: "Elegante Boda",
      type: "wedding" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
    {
      id: "2",
      name: "Fiesta de Cumpleaños",
      type: "birthday" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
    {
      id: "3",
      name: "Evento Corporativo",
      type: "corporate" as const,
      html_content: "",
      css_styles: "",
      preview_image: undefined,
      is_active: true,
      created_at: "",
    },
  ];

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);

    try {
      // Create event using localStorage
      const newEvent = eventStorage.add({
        title: data.title,
        description: data.description || "",
        date: data.date,
        time: data.time,
        location: data.location,
        maxGuests: data.settings.maxGuestsPerInvite * 50, // Default max guests
        confirmedGuests: 0,
        status: "draft"
      });

      toast.success("Evento creado exitosamente");
      router.push(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error al crear el evento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Eventos
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">
            Crear Nuevo Evento
          </h1>
          <p className="text-gray-600 mt-1">
            Completa la información de tu evento
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <EventForm
          templates={templates}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Check, Search, ExternalLink, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { generateWhatsAppMessage } from "./message-template-editor";
import type { Database } from "@/types/database.types";

type Guest = Database['public']['Tables']['guests']['Row'];

interface BulkWhatsAppSenderProps {
  guests: Guest[];
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  hostName: string;
  invitationBaseUrl: string;
  messageTemplate: string;
  onMarkAsSent?: (guestId: string) => Promise<void>;
}

interface GuestWithWhatsApp extends Guest {
  whatsappUrl: string;
  message: string;
}

export function BulkWhatsAppSender({
  guests,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  hostName,
  invitationBaseUrl,
  messageTemplate,
  onMarkAsSent,
}: BulkWhatsAppSenderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentGuests, setSentGuests] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Function to encode message for WhatsApp while preserving emojis
  const encodeWhatsAppMessage = (message: string): string => {
    // WhatsApp accepts emojis and most Unicode characters directly
    // We only need to encode special URL characters
    return message
      .replace(/%/g, '%25')  // Encode % first
      .replace(/&/g, '%26')
      .replace(/=/g, '%3D')
      .replace(/\?/g, '%3F')
      .replace(/#/g, '%23')
      .replace(/\n/g, '%0A')  // Newlines
      .replace(/\r/g, '')      // Remove carriage returns
      .replace(/\+/g, '%2B');
  };

  // Generate WhatsApp URLs for all guests
  const guestsWithWhatsApp = useMemo<GuestWithWhatsApp[]>(() => {
    return guests.map(guest => {
      const message = generateWhatsAppMessage(
        messageTemplate,
        guest.name,
        eventTitle,
        eventDate,
        eventTime,
        eventLocation,
        hostName,
        invitationBaseUrl
      );

      // Clean phone number for WhatsApp
      const cleanPhone = guest.phone?.replace(/\D/g, '') || '';
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeWhatsAppMessage(message)}`;

      return {
        ...guest,
        whatsappUrl,
        message,
      };
    });
  }, [guests, messageTemplate, eventTitle, eventDate, eventTime, eventLocation, hostName, invitationBaseUrl]);

  // Filter guests based on search term
  const filteredGuests = useMemo(() => {
    if (!searchTerm.trim()) return guestsWithWhatsApp;

    const search = searchTerm.toLowerCase();
    return guestsWithWhatsApp.filter(guest =>
      guest.name.toLowerCase().includes(search) ||
      guest.phone?.toLowerCase().includes(search) ||
      guest.email?.toLowerCase().includes(search)
    );
  }, [guestsWithWhatsApp, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const total = guests.length;
    const sent = guests.filter(g => g.whatsapp_sent).length;
    const pending = total - sent;
    const withPhone = guests.filter(g => g.phone).length;
    const withoutPhone = total - withPhone;

    return { total, sent, pending, withPhone, withoutPhone };
  }, [guests]);

  const handleSendToGuest = async (guest: GuestWithWhatsApp) => {
    // Open WhatsApp in new tab
    window.open(guest.whatsappUrl, '_blank');

    // Mark as sent locally
    setSentGuests(prev => new Set([...prev, guest.id]));

    // Call callback to update database
    if (onMarkAsSent) {
      try {
        await onMarkAsSent(guest.id);
        toast.success(`Invitación enviada a ${guest.name}`);
      } catch (error) {
        toast.error('Error al marcar como enviado');
        console.error('Error marking as sent:', error);
      }
    }
  };

  const handleCopyMessage = async (guest: GuestWithWhatsApp) => {
    try {
      await navigator.clipboard.writeText(guest.message);
      setCopiedId(guest.id);
      toast.success('Mensaje copiado');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Error al copiar mensaje');
    }
  };

  const handleCopyAllLinks = async () => {
    const allLinks = filteredGuests
      .filter(g => g.phone)
      .map(g => `${g.name}: ${g.whatsappUrl}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(allLinks);
      toast.success('Todos los enlaces copiados');
    } catch {
      toast.error('Error al copiar enlaces');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Nombre', 'Teléfono', 'Email', 'Estado', 'Enlace WhatsApp', 'Mensaje'].join(','),
      ...filteredGuests.map(g => [
        `"${g.name}"`,
        g.phone || '',
        g.email || '',
        g.whatsapp_sent ? 'Enviado' : 'Pendiente',
        `"${g.whatsappUrl}"`,
        `"${g.message.replace(/"/g, '""')}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invitaciones_whatsapp_${eventTitle.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV exportado');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Enviados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.withPhone}</div>
            <div className="text-sm text-muted-foreground">Con teléfono</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.withoutPhone}</div>
            <div className="text-sm text-muted-foreground">Sin teléfono</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Envío Masivo de Invitaciones
              </CardTitle>
              <CardDescription>
                Envía invitaciones personalizadas por WhatsApp a todos tus invitados
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAllLinks}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copiar Enlaces
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar invitado por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Guest List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No se encontraron invitados' : 'No hay invitados con teléfono'}
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const isSent = guest.whatsapp_sent || sentGuests.has(guest.id);
                const hasPhone = !!guest.phone;

                return (
                  <Card key={guest.id} className={isSent ? 'bg-green-50 border-green-200' : ''}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Guest Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate">{guest.name}</h4>
                            {isSent && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Enviado
                              </Badge>
                            )}
                            {!hasPhone && (
                              <Badge variant="destructive">
                                Sin teléfono
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            {guest.phone && (
                              <div className="flex items-center gap-2">
                                <span>📱 {guest.phone}</span>
                              </div>
                            )}
                            {guest.email && (
                              <div className="flex items-center gap-2">
                                <span>📧 {guest.email}</span>
                              </div>
                            )}
                            {guest.guest_count > 1 && (
                              <div className="text-xs">
                                👥 {guest.guest_count} personas
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyMessage(guest)}
                            disabled={!hasPhone}
                            className="gap-2"
                          >
                            {copiedId === guest.id ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendToGuest(guest)}
                            disabled={!hasPhone}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Enviar
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Message Preview (Collapsed) */}
                      {hasPhone && (
                        <details className="mt-3">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            Ver mensaje personalizado
                          </summary>
                          <div className="mt-2 p-3 bg-white border rounded-lg text-sm">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700">
                              {guest.message}
                            </pre>
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

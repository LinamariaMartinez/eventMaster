"use client";

// WhatsApp Business API Integration
// This service handles WhatsApp message creation and sending

export interface WhatsAppMessage {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  hostName?: string;
  guestName?: string;
}

export interface WhatsAppConfig {
  businessNumber: string; // WhatsApp Business number
  apiUrl?: string; // Optional custom API URL
}

export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  // Generate WhatsApp message URL with pre-filled text
  generateWhatsAppUrl(message: WhatsAppMessage): string {
    const messageText = this.formatMessage(message);
    const encodedMessage = encodeURIComponent(messageText);
    return `https://wa.me/${this.config.businessNumber}?text=${encodedMessage}`;
  }

  // Format the message template
  private formatMessage(message: WhatsAppMessage): string {
    const { eventTitle, eventDate, eventTime, venue, hostName, guestName } = message;
    
    let text = `¡Hola! 👋\n\n`;
    
    if (guestName) {
      text += `Soy ${guestName} y `;
    }
    
    text += `me gustaría confirmar mi asistencia al evento:\n\n`;
    text += `🎉 *${eventTitle}*\n`;
    text += `📅 Fecha: ${eventDate}\n`;
    text += `🕒 Hora: ${eventTime}\n`;
    text += `📍 Lugar: ${venue}\n`;
    
    if (hostName) {
      text += `\nOrganizado por: ${hostName}\n`;
    }
    
    text += `\n✅ *CONFIRMO MI ASISTENCIA*\n\n`;
    text += `Por favor, confirmen que recibieron este mensaje.\n\n`;
    text += `¡Gracias! 😊`;
    
    return text;
  }

  // Test WhatsApp integration (opens WhatsApp Web/App)
  async testConnection(message: WhatsAppMessage): Promise<boolean> {
    try {
      const url = this.generateWhatsAppUrl(message);
      
      // In a real app, you might want to check if WhatsApp is available
      // For now, we'll simulate opening the URL
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error testing WhatsApp connection:', error);
      return false;
    }
  }

  // Validate phone number format
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (usually 10-15 digits)
    // Colombian numbers are typically 10 digits with country code 57
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Format phone number for WhatsApp (remove + and spaces)
  static formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  // Generate analytics data for WhatsApp interactions
  generateAnalytics(message: WhatsAppMessage) {
    return {
      timestamp: new Date().toISOString(),
      eventTitle: message.eventTitle,
      messageLength: this.formatMessage(message).length,
      hasGuestName: !!message.guestName,
      hasHostName: !!message.hostName,
    };
  }
}

// Default WhatsApp service instance with Colombian number
export const defaultWhatsAppService = new WhatsAppService({
  businessNumber: '573001234567', // Example Colombian number
});

// Utility function to create WhatsApp link for invitations
export function createWhatsAppInvitationLink(
  invitation: {
    title?: string;
    content?: {
      eventDate?: string;
      eventTime?: string;
      venue?: string;
      hostName?: string;
    };
  },
  guestName?: string
): string {
  const message: WhatsAppMessage = {
    eventTitle: invitation.title || 'Evento Especial',
    eventDate: invitation.content?.eventDate || 'Por confirmar',
    eventTime: invitation.content?.eventTime || 'Por confirmar',
    venue: invitation.content?.venue || 'Por confirmar',
    hostName: invitation.content?.hostName,
    guestName,
  };

  return defaultWhatsAppService.generateWhatsAppUrl(message);
}

// Test function for development
export async function testWhatsAppIntegration() {
  const testMessage: WhatsAppMessage = {
    eventTitle: 'Prueba de Integración WhatsApp',
    eventDate: '15 de Febrero, 2025',
    eventTime: '7:00 PM',
    venue: 'Centro de Eventos Test',
    hostName: 'Catalina Lezama',
    guestName: 'Usuario de Prueba',
  };

  console.log('Testing WhatsApp Integration...');
  console.log('Message URL:', defaultWhatsAppService.generateWhatsAppUrl(testMessage));
  console.log('Analytics:', defaultWhatsAppService.generateAnalytics(testMessage));

  return await defaultWhatsAppService.testConnection(testMessage);
}
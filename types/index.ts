export interface Event {
  id: string;
  user_id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  maxGuests: number;
  status: "draft" | "published" | "cancelled";
  template_id?: string;
  settings: EventSettings;
  sheets_url?: string;
  public_url: string;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  allowPlusOnes: boolean;
  requirePhone: boolean;
  requireEmail: boolean;
  maxGuestsPerInvite: number;
  rsvpDeadline?: string;
  customFields: CustomField[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface CustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox";
  required: boolean;
  options?: string[];
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  phone?: string;
  status: "pending" | "confirmed" | "declined";
  guest_count: number;
  message?: string;
  dietary_restrictions?: string;
  invitedAt: string;
  respondedAt?: string;
  created_at: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  title: string;
  message: string;
  template: "formal" | "casual" | "corporate";
  uniqueUrl: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "reminder" | "update" | "alert";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface EventStats {
  totalEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingResponses: number;
  upcomingEvents: number;
}

export interface Template {
  id: string;
  name: string;
  type: "wedding" | "birthday" | "corporate";
  html_content: string;
  css_styles: string;
  preview_image?: string;
  is_active: boolean;
}

export interface Confirmation {
  id: string;
  event_id: string;
  guest_id?: string;
  response: "yes" | "no" | "maybe";
  confirmed_at: string;
  additional_notes?: string;
  name: string;
  email?: string;
  phone?: string;
  guest_count: number;
  dietary_restrictions?: string;
  custom_responses: Record<string, string | number | boolean>;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "user";
  created_at: string;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingResponses: number;
}

export interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  template_id?: string;
  whatsapp_number?: string;
  settings: EventSettings;
}

export interface GuestFormData {
  name: string;
  email?: string;
  phone?: string;
}

export interface ConfirmationFormData {
  name: string;
  email?: string;
  phone?: string;
  response: "yes" | "no" | "maybe";
  guest_count: number;
  dietary_restrictions?: string;
  additional_notes?: string;
  custom_responses?: Record<string, string | number | boolean>;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  worksheetTitle: string;
  headers: string[];
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type EventStatus = "upcoming" | "ongoing" | "past";
export type GuestStatus = "pending" | "confirmed" | "declined";
export type TemplateType = "wedding" | "birthday" | "corporate";
export type ResponseType = "yes" | "no" | "maybe";

// Utilidad para validaciones
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
}

// Tipos para autenticación
export interface AuthSession {
  user: User | null;
  loading: boolean;
}

// Tipos para notificaciones
export interface NotificationConfig {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          time: string
          location: string
          description: string | null
          template_id: string | null
          settings: Json
          sheets_url: string | null
          public_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          time: string
          location: string
          description?: string | null
          template_id?: string | null
          settings: Json
          sheets_url?: string | null
          public_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          time?: string
          location?: string
          description?: string | null
          template_id?: string | null
          settings?: Json
          sheets_url?: string | null
          public_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string | null
          phone: string | null
          status: 'pending' | 'confirmed' | 'declined'
          guest_count: number
          message: string | null
          dietary_restrictions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email?: string | null
          phone?: string | null
          status?: 'pending' | 'confirmed' | 'declined'
          guest_count?: number
          message?: string | null
          dietary_restrictions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          status?: 'pending' | 'confirmed' | 'declined'
          guest_count?: number
          message?: string | null
          dietary_restrictions?: string | null
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          type: 'wedding' | 'birthday' | 'corporate'
          html_content: string
          css_styles: string
          preview_image: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'wedding' | 'birthday' | 'corporate'
          html_content: string
          css_styles: string
          preview_image?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'wedding' | 'birthday' | 'corporate'
          html_content?: string
          css_styles?: string
          preview_image?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      confirmations: {
        Row: {
          id: string
          event_id: string
          guest_id: string | null
          response: 'yes' | 'no' | 'maybe'
          confirmed_at: string
          additional_notes: string | null
          name: string
          email: string | null
          phone: string | null
          guest_count: number
          dietary_restrictions: string | null
          custom_responses: Json | null
        }
        Insert: {
          id?: string
          event_id: string
          guest_id?: string | null
          response: 'yes' | 'no' | 'maybe'
          confirmed_at?: string
          additional_notes?: string | null
          name: string
          email?: string | null
          phone?: string | null
          guest_count?: number
          dietary_restrictions?: string | null
          custom_responses?: Json | null
        }
        Update: {
          id?: string
          event_id?: string
          guest_id?: string | null
          response?: 'yes' | 'no' | 'maybe'
          confirmed_at?: string
          additional_notes?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          guest_count?: number
          dietary_restrictions?: string | null
          custom_responses?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      guest_status: 'pending' | 'confirmed' | 'declined'
      template_type: 'wedding' | 'birthday' | 'corporate'
      response_type: 'yes' | 'no' | 'maybe'
    }
  }
}
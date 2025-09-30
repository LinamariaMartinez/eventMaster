import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addConfirmationToSheet } from '@/lib/google-sheets'
import { z } from 'zod'
import type { Database } from '@/types/database.types'

const confirmationSchema = z.object({
  event_id: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  response: z.enum(['yes', 'no', 'maybe']),
  guest_count: z.number().min(1).max(10),
  dietary_restrictions: z.string().optional(),
  additional_notes: z.string().optional(),
  custom_responses: z.record(z.string(), z.unknown()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = confirmationSchema.parse(body)

    const supabase = await createClient()

    // Verificar que el evento existe
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, sheets_url, settings')
      .eq('id', data.event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Type assertion for event
    type EventData = { id: string; title: string; sheets_url: string | null; settings: Database['public']['Tables']['events']['Row']['settings'] }
    const typedEvent = event as EventData

    // Crear la confirmación en la base de datos
    const confirmationData: Database['public']['Tables']['confirmations']['Insert'] = {
      event_id: data.event_id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      response: data.response,
      guest_count: data.guest_count,
      dietary_restrictions: data.dietary_restrictions || null,
      additional_notes: data.additional_notes || null,
      custom_responses: (data.custom_responses as Database['public']['Tables']['confirmations']['Row']['custom_responses']) || null
    }

    const { data: confirmation, error: confirmationError } = await supabase
      .from('confirmations')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(confirmationData as any)
      .select()
      .single()

    if (confirmationError) {
      console.error('Error creating confirmation:', confirmationError)
      return NextResponse.json(
        { error: 'Error al crear la confirmación' },
        { status: 500 }
      )
    }

    // Agregar a Google Sheets si está configurado
    if (typedEvent.sheets_url) {
      try {
        const spreadsheetId = extractSpreadsheetId(typedEvent.sheets_url)
        if (spreadsheetId) {
          await addConfirmationToSheet(spreadsheetId, {
            name: data.name,
            email: data.email,
            phone: data.phone,
            response: data.response,
            guest_count: data.guest_count,
            dietary_restrictions: data.dietary_restrictions,
            additional_notes: data.additional_notes
          })
        }
      } catch (sheetsError) {
        console.error('Error adding to Google Sheets:', sheetsError)
        // No fallar la request si Google Sheets falla
      }
    }

    // También buscar si hay un guest existente con ese email/nombre
    if (data.email) {
      const guestUpdate = {
        status: data.response === 'yes' ? 'confirmed' : data.response === 'no' ? 'declined' : 'pending',
        guest_count: data.guest_count,
        message: data.additional_notes || null,
        dietary_restrictions: data.dietary_restrictions || null
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase.from('guests').update as any)(guestUpdate)
        .eq('event_id', data.event_id)
        .eq('email', data.email)

      if (updateError) {
        console.error('Error updating guest status:', updateError)
      }
    }

    return NextResponse.json({
      message: 'Confirmación recibida exitosamente',
      confirmation
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in confirmations API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('event_id')

    if (!eventId) {
      return NextResponse.json(
        { error: 'event_id es requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar autenticación para ver confirmaciones
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener confirmaciones del evento
    const { data: confirmations, error } = await supabase
      .from('confirmations')
      .select('*')
      .eq('event_id', eventId)
      .order('confirmed_at', { ascending: false })

    if (error) {
      console.error('Error fetching confirmations:', error)
      return NextResponse.json(
        { error: 'Error al obtener confirmaciones' },
        { status: 500 }
      )
    }

    return NextResponse.json({ confirmations })

  } catch (error) {
    console.error('Error in GET confirmations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función helper para extraer el ID de la hoja de Google Sheets
function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}
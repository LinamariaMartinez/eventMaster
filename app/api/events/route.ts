import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { createEventSpreadsheet } from '@/lib/google-sheets'
import { generatePublicUrl } from '@/lib/utils'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1),
  date: z.string(),
  time: z.string(),
  location: z.string().min(1),
  description: z.string().optional(),
  template_id: z.string().optional(),
  settings: z.object({
    allowPlusOnes: z.boolean(),
    requirePhone: z.boolean(),
    requireEmail: z.boolean(),
    maxGuestsPerInvite: z.number().min(1).max(10),
    rsvpDeadline: z.string().optional(),
    customFields: z.array(z.any()).optional(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string()
    })
  })
})

export async function GET() {
  try {
    const supabase = await getSupabaseServer()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener eventos del usuario
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json(
        { error: 'Error al obtener eventos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ events })

  } catch (error) {
    console.error('Error in GET events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = eventSchema.parse(body)

    const supabase = await getSupabaseServer()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Generar ID único para el evento
    const eventId = crypto.randomUUID()
    const publicUrl = generatePublicUrl(eventId)

    // Crear Google Sheets para el evento
    let sheetsUrl = null
    try {
      const { url } = await createEventSpreadsheet(data.title, data.date)
      sheetsUrl = url
    } catch (sheetsError) {
      console.error('Error creating Google Sheets:', sheetsError)
      // Continuar sin Google Sheets si falla
    }

    // Crear evento en la base de datos
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        id: eventId,
        user_id: user.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location,
        description: data.description || null,
        template_id: data.template_id || null,
        settings: data.settings,
        sheets_url: sheetsUrl,
        public_url: publicUrl
      })
      .select()
      .single()

    if (eventError) {
      console.error('Error creating event:', eventError)
      return NextResponse.json(
        { error: 'Error al crear el evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Evento creado exitosamente',
      event
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in POST events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
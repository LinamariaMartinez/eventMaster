import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

const duplicateEventSchema = z.object({
  whatsapp_number: z.string().min(1, "El número de WhatsApp es requerido"),
  host_name: z.string().optional(),
})

// POST - Duplicar evento
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { whatsapp_number, host_name } = duplicateEventSchema.parse(body)

    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el evento original
    const { data: originalEvent, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !originalEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Generar nuevo public_url único
    const publicUrl = `${originalEvent.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    // Preparar datos del evento duplicado
    const newEventData = {
      user_id: user.id,
      title: `${originalEvent.title} (Copia)`,
      date: originalEvent.date,
      time: originalEvent.time,
      location: originalEvent.location,
      description: host_name
        ? `${originalEvent.description || ''}\nAnfitrión: ${host_name}`.trim()
        : originalEvent.description,
      template_id: originalEvent.template_id,
      settings: originalEvent.settings,
      sheets_url: null, // No copiar la URL de sheets
      public_url: publicUrl,
      whatsapp_number: whatsapp_number,
    }

    // Crear evento duplicado
    const { data: newEvent, error: createError } = await supabase
      .from('events')
      .insert(newEventData)
      .select()
      .single()

    if (createError) {
      console.error('Error creating duplicated event:', createError)
      return NextResponse.json(
        { error: 'Error al duplicar el evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Evento duplicado exitosamente',
      event: newEvent
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in POST duplicate event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

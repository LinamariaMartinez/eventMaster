import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().min(1).optional(),
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
  }).optional()
})

// GET - Obtener evento específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const includeGuests = searchParams.get('include_guests') === 'true'
    const includeConfirmations = searchParams.get('include_confirmations') === 'true'

    // Para eventos públicos (invitaciones), no requerir autenticación
    const isPublicAccess = searchParams.get('public') === 'true'

    if (!isPublicAccess) {
      // Verificar autenticación para acceso privado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        )
      }

      // Verificar que el evento pertenece al usuario
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Evento no encontrado' },
          { status: 404 }
        )
      }

      const responseData: Record<string, unknown> = { event }

      // Incluir invitados si se solicita
      if (includeGuests) {
        const { data: guests } = await supabase
          .from('guests')
          .select('*')
          .eq('event_id', resolvedParams.id)
          .order('created_at', { ascending: false })

        responseData.guests = guests || []
      }

      // Incluir confirmaciones si se solicita
      if (includeConfirmations) {
        const { data: confirmations } = await supabase
          .from('confirmations')
          .select('*')
          .eq('event_id', resolvedParams.id)
          .order('confirmed_at', { ascending: false })

        responseData.confirmations = confirmations || []
      }

      return NextResponse.json(responseData)
    } else {
      // Acceso público - solo información básica del evento
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, title, date, time, location, description, settings')
        .eq('id', resolvedParams.id)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Evento no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({ event })
    }

  } catch (error) {
    console.error('Error in GET event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar evento
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const data = updateEventSchema.parse(body)

    const supabase = await getSupabaseServer()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el evento pertenece al usuario
    const { data: existingEvent, error: checkError } = await supabase
      .from('events')
      .select('id, user_id')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar evento
    const { data: event, error: updateError } = await supabase
      .from('events')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating event:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Evento actualizado exitosamente',
      event
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in PUT event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar evento
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const supabase = await getSupabaseServer()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el evento pertenece al usuario
    const { data: existingEvent, error: checkError } = await supabase
      .from('events')
      .select('id, user_id')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar evento (las confirmaciones y invitados se eliminan en cascada)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', resolvedParams.id)

    if (deleteError) {
      console.error('Error deleting event:', deleteError)
      return NextResponse.json(
        { error: 'Error al eliminar el evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Evento eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error in DELETE event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
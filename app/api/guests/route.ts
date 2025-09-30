import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const guestSchema = z.object({
  event_id: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  guest_count: z.number().min(1).max(10).optional().default(1),
  message: z.string().optional(),
  dietary_restrictions: z.string().optional()
})

const bulkGuestsSchema = z.object({
  event_id: z.string(),
  guests: z.array(z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    guest_count: z.number().min(1).max(10).optional().default(1),
    message: z.string().optional(),
    dietary_restrictions: z.string().optional()
  }))
})

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

    // Verificar autenticación
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
      .select('id')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Obtener invitados
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (guestsError) {
      console.error('Error fetching guests:', guestsError)
      return NextResponse.json(
        { error: 'Error al obtener invitados' },
        { status: 500 }
      )
    }

    return NextResponse.json({ guests: guests || [] })

  } catch (error) {
    console.error('Error in GET guests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if it's a bulk import or single guest
    const isBulkImport = body.guests && Array.isArray(body.guests)
    
    if (isBulkImport) {
      const data = bulkGuestsSchema.parse(body)
      
      const supabase = await createClient()

      // Verificar autenticación
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
        .select('id')
        .eq('id', data.event_id)
        .eq('user_id', user.id)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Evento no encontrado' },
          { status: 404 }
        )
      }

      // Insertar invitados en lotes
      const guestsToInsert = data.guests.map(guest => ({
        event_id: data.event_id,
        name: guest.name,
        email: guest.email || null,
        phone: guest.phone || null,
        guest_count: guest.guest_count || 1,
        message: guest.message || null,
        dietary_restrictions: guest.dietary_restrictions || null,
        status: 'pending' as const
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: insertedGuests, error: insertError } = await (supabase.from('guests').insert as any)(guestsToInsert)
        .select()

      if (insertError) {
        console.error('Error inserting guests:', insertError)
        return NextResponse.json(
          { error: 'Error al crear los invitados' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: `${data.guests.length} invitados creados exitosamente`,
        guests: insertedGuests
      }, { status: 201 })

    } else {
      // Single guest creation
      const data = guestSchema.parse(body)
      
      const supabase = await createClient()

      // Verificar autenticación
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
        .select('id')
        .eq('id', data.event_id)
        .eq('user_id', user.id)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Evento no encontrado' },
          { status: 404 }
        )
      }

      // Crear invitado
      const guestData = {
        event_id: data.event_id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        guest_count: data.guest_count,
        message: data.message || null,
        dietary_restrictions: data.dietary_restrictions || null,
        status: 'pending' as const
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: guest, error: guestError } = await (supabase.from('guests').insert as any)(guestData)
        .select()
        .single()

      if (guestError) {
        console.error('Error creating guest:', guestError)
        return NextResponse.json(
          { error: 'Error al crear el invitado' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Invitado creado exitosamente',
        guest
      }, { status: 201 })
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error in POST guests:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
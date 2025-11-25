import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the first event to check structure
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, whatsapp_number')
      .limit(5)

    if (error) {
      return NextResponse.json({
        error: error.message,
        hint: 'La columna whatsapp_number probablemente no existe en la base de datos',
        solution: 'Ejecuta la migración: supabase/migrations/add_event_whatsapp_number.sql'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'La columna whatsapp_number existe',
      events: events,
      count: events?.length || 0
    })

  } catch (error) {
    console.error('Error checking whatsapp column:', error)
    return NextResponse.json({
      error: 'Error al verificar la columna',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

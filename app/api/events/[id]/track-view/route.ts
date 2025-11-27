import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// Helper function to hash IP address for privacy
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (cfConnectingIP) return cfConnectingIP
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP

  // Fallback to a generic identifier
  return 'unknown'
}

// POST - Track invitation view
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const eventId = resolvedParams.id

    // Verify event exists
    const supabase = await createClient()
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Get client information
    const clientIP = getClientIP(request)
    const ipHash = hashIP(clientIP)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null

    // Insert view record
    const { error: insertError } = await supabase
      .from('invitation_views')
      .insert({
        event_id: eventId,
        ip_hash: ipHash,
        user_agent: userAgent,
        referer: referer,
        viewed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error inserting view:', insertError)
      // Don't fail the request if tracking fails - just log it
      return NextResponse.json(
        { success: false, error: 'Error al registrar visita' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Visita registrada exitosamente'
    })

  } catch (error) {
    console.error('Error in POST track-view:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

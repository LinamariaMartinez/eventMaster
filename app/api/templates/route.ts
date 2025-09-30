import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // wedding, birthday, corporate
    const activeOnly = searchParams.get('active') !== 'false' // default true

    const supabase = await createClient()

    let query = supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    if (type) {
      query = query.eq('type', type)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json(
        { error: 'Error al obtener plantillas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ templates: templates || [] })

  } catch (error) {
    console.error('Error in GET templates:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, html_content, css_styles, preview_image } = body

    if (!name || !type || !html_content || !css_styles) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar autenticación (solo admins pueden crear plantillas)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Crear plantilla
    const templateData = {
      name,
      type,
      html_content,
      css_styles,
      preview_image: preview_image || null,
      is_active: true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: template, error: templateError } = await (supabase.from('templates').insert as any)(templateData)
      .select()
      .single()

    if (templateError) {
      console.error('Error creating template:', templateError)
      return NextResponse.json(
        { error: 'Error al crear la plantilla' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Plantilla creada exitosamente',
      template
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST templates:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
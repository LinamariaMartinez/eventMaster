import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ message: 'Google Sheets API endpoint' })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Error en el endpoint de Google Sheets' },
      { status: 500 }
    )
  }
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json()
    
    return NextResponse.json({ 
      message: 'Datos enviados a Google Sheets',
      data: body 
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Error al procesar los datos' },
      { status: 500 }
    )
  }
}
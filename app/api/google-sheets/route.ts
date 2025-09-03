import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4' })

// Create auth client
function createAuthClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials not configured')
  }
  
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
}

export async function GET() {
  try {
    const auth = createAuthClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheet ID not configured' },
        { status: 400 }
      )
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'A1:Z1000', // Read all data
    })

    return NextResponse.json({ 
      message: 'Google Sheets data retrieved',
      data: response.data.values 
    })
  } catch (error) {
    console.error('Google Sheets API Error:', error)
    return NextResponse.json(
      { error: 'Error accessing Google Sheets: ' + (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guestData, eventData, action } = body
    
    const auth = createAuthClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheet ID not configured' },
        { status: 400 }
      )
    }

    if (action === 'confirm_guest') {
      // Add guest confirmation to Google Sheets
      const values = [[
        new Date().toISOString(), // Timestamp
        eventData?.title || 'Unknown Event',
        eventData?.date || '',
        eventData?.time || '',
        eventData?.location || '',
        guestData?.name || '',
        guestData?.email || '',
        guestData?.phone || '',
        guestData?.status || 'confirmed',
        guestData?.guest_count || 1,
        guestData?.dietary_restrictions || '',
        guestData?.message || ''
      ]]

      // First, ensure the sheet has headers
      const headerResponse = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'A1:L1',
      })

      // If no headers exist, add them
      if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: 'A1:L1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              'Fecha/Hora',
              'Evento',
              'Fecha Evento',
              'Hora Evento', 
              'Ubicación',
              'Nombre',
              'Email',
              'Teléfono',
              'Estado',
              'Acompañantes',
              'Restricciones Dietarias',
              'Mensaje'
            ]]
          }
        })
      }

      // Append the guest data
      const appendResponse = await sheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'A:L',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      })

      return NextResponse.json({ 
        message: 'Guest confirmation added to Google Sheets successfully',
        data: appendResponse.data
      })
    }

    return NextResponse.json({ 
      message: 'Invalid action',
      data: body 
    }, { status: 400 })
    
  } catch (error) {
    console.error('Google Sheets API Error:', error)
    return NextResponse.json(
      { error: 'Error updating Google Sheets: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
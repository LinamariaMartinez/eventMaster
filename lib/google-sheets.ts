import { google } from 'googleapis'

// Configuración de autenticación para Google APIs
const getGoogleAuth = () => {
  const credentials = {
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
    client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
  }

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
  })
}

// Configuración de Google Sheets API
const getGoogleSheetsClient = () => {
  const auth = getGoogleAuth()
  return google.sheets({ version: 'v4', auth })
}

// Crear una nueva hoja de Google Sheets para un evento
export async function createEventSpreadsheet(eventTitle: string, eventDate: string) {
  try {
    const sheets = getGoogleSheetsClient()
    
    // Crear una nueva hoja
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `${eventTitle} - Confirmaciones (${eventDate})`
        },
        sheets: [{
          properties: {
            title: 'Confirmaciones'
          }
        }]
      }
    })

    const spreadsheetId = response.data.spreadsheetId!

    // Configurar encabezados
    const headers = [
      'Timestamp',
      'Nombre',
      'Email',
      'Teléfono',
      'Asistencia',
      'Número de Invitados',
      'Restricciones Dietarias',
      'Mensaje Adicional',
      'Estado'
    ]

    // Insertar encabezados
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1:I1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers]
      }
    })

    // Formatear encabezados (negrita, color de fondo)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.545,
                    green: 0.294,
                    blue: 0.420
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: headers.length
              }
            }
          }
        ]
      }
    })

    // Hacer la hoja pública para lectura
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addProtectedRange: {
              protectedRange: {
                range: {
                  sheetId: 0
                },
                description: 'Protección para mantener formato',
                editors: {
                  users: [process.env.GOOGLE_SHEETS_CLIENT_EMAIL!]
                }
              }
            }
          }
        ]
      }
    })

    return {
      spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`
    }
  } catch (error) {
    console.error('Error creating Google Sheets:', error)
    throw new Error('Failed to create Google Sheets spreadsheet')
  }
}

// Agregar una confirmación a la hoja de Google Sheets
export async function addConfirmationToSheet(
  spreadsheetId: string,
  confirmation: {
    name: string
    email?: string
    phone?: string
    response: 'yes' | 'no' | 'maybe'
    guest_count: number
    dietary_restrictions?: string
    additional_notes?: string
  }
) {
  try {
    const sheets = getGoogleSheetsClient()
    
    const timestamp = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    })

    const responseText = {
      'yes': 'Confirmado',
      'no': 'Declinó',
      'maybe': 'Tal vez'
    }[confirmation.response]

    const row = [
      timestamp,
      confirmation.name,
      confirmation.email || '',
      confirmation.phone || '',
      responseText,
      confirmation.guest_count.toString(),
      confirmation.dietary_restrictions || '',
      confirmation.additional_notes || '',
      'Activo'
    ]

    // Agregar la fila
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:I',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row]
      }
    })

    // Aplicar formato condicional basado en la respuesta
    const updatedRowIndex = result.data.updates?.updatedRange
      ? parseInt(result.data.updates.updatedRange.split(':')[0].slice(1)) - 1
      : 1

    let backgroundColor = { red: 1, green: 1, blue: 1 } // Blanco por defecto

    switch (confirmation.response) {
      case 'yes':
        backgroundColor = { red: 0.851, green: 0.918, blue: 0.827 } // Verde claro
        break
      case 'no':
        backgroundColor = { red: 0.957, green: 0.863, blue: 0.863 } // Rojo claro
        break
      case 'maybe':
        backgroundColor = { red: 1.000, green: 0.949, blue: 0.800 } // Amarillo claro
        break
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: updatedRowIndex,
                endRowIndex: updatedRowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: 9
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor
                }
              },
              fields: 'userEnteredFormat(backgroundColor)'
            }
          }
        ]
      }
    })

    return result.data
  } catch (error) {
    console.error('Error adding to Google Sheets:', error)
    throw new Error('Failed to add confirmation to Google Sheets')
  }
}

// Obtener todas las confirmaciones de una hoja
export async function getConfirmationsFromSheet(spreadsheetId: string) {
  try {
    const sheets = getGoogleSheetsClient()
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A2:I'  // Desde la segunda fila (saltando encabezados)
    })

    const rows = response.data.values || []
    
    return rows.map(row => ({
      timestamp: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      response: row[4] || '',
      guest_count: parseInt(row[5]) || 1,
      dietary_restrictions: row[6] || '',
      additional_notes: row[7] || '',
      status: row[8] || ''
    }))
  } catch (error) {
    console.error('Error reading from Google Sheets:', error)
    throw new Error('Failed to read confirmations from Google Sheets')
  }
}

// Actualizar permisos de la hoja para el equipo
export async function shareSpreadsheetWithTeam(spreadsheetId: string, emails: string[]) {
  try {
    const auth = getGoogleAuth()
    const drive = google.drive({ version: 'v3', auth })
    
    // Compartir con cada email del equipo
    for (const email of emails) {
      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: email
        }
      })
    }

    return true
  } catch (error) {
    console.error('Error sharing spreadsheet:', error)
    throw new Error('Failed to share spreadsheet with team')
  }
}

// Función de utilidad para validar configuración
export function validateGoogleSheetsConfig() {
  const required = [
    'GOOGLE_SHEETS_PRIVATE_KEY',
    'GOOGLE_SHEETS_CLIENT_EMAIL',
    'GOOGLE_SHEETS_PRIVATE_KEY_ID',
    'GOOGLE_SHEETS_CLIENT_ID'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required Google Sheets environment variables: ${missing.join(', ')}`)
  }

  return true
}
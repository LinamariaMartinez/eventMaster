'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  Download, 
  CheckCircle, 
  X
} from "lucide-react"
import Papa from "papaparse"
import { toast } from "sonner"

interface GuestImport {
  name: string
  email?: string
  phone?: string
  guest_count: number
  message?: string
  dietary_restrictions?: string
}

interface CSVImportProps {
  onImport: (guests: GuestImport[]) => Promise<void>
  onClose: () => void
}

export function CSVImport({ onImport, onClose }: CSVImportProps) {
  const [dragActive, setDragActive] = useState(false)
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [preview, setPreview] = useState<Record<string, string>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor selecciona un archivo CSV válido')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors)
          toast.error('Error al procesar el archivo CSV')
          return
        }

        const data = results.data as Record<string, string>[]
        setCsvData(data)
        setPreview(data.slice(0, 5)) // Show first 5 rows as preview
        
        toast.success(`${data.length} registros cargados para vista previa`)
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        toast.error('Error al leer el archivo CSV')
      }
    })
  }

  const handleImport = async () => {
    if (csvData.length === 0) return

    setIsLoading(true)
    try {
      // Validate and transform CSV data
      const validGuests = csvData
        .filter(row => row.nombre || row.name) // Must have a name
        .map(row => ({
          name: row.nombre || row.name,
          email: row.email || row.correo,
          phone: row.telefono || row.phone || row.teléfono,
          guest_count: parseInt(row.acompañantes || row.guests || row.guest_count) || 1,
          message: row.mensaje || row.message || '',
          dietary_restrictions: row.restricciones || row.dietary_restrictions || ''
        }))

      if (validGuests.length === 0) {
        toast.error('No se encontraron registros válidos en el archivo')
        return
      }

      await onImport(validGuests)
      toast.success(`${validGuests.length} invitados importados correctamente`)
      onClose()
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Error al importar los invitados')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      {
        nombre: 'María Pérez',
        email: 'maria@example.com',
        telefono: '+57 300 123 4567',
        acompañantes: '2',
        mensaje: 'Esperamos con ansias este momento',
        restricciones: 'Vegetariana'
      },
      {
        nombre: 'Carlos García',
        email: 'carlos@example.com',
        telefono: '+57 301 234 5678',
        acompañantes: '1',
        mensaje: '',
        restricciones: ''
      }
    ]

    const csv = Papa.unparse(template)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "plantilla_invitados.csv")
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Importar Invitados desde CSV</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Carga un archivo CSV con la lista de invitados
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">
                  ¿Necesitas una plantilla?
                </h4>
                <p className="text-sm text-blue-700">
                  Descarga nuestra plantilla CSV con el formato correcto
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label>Archivo CSV</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[#8B4B6B] bg-[#8B4B6B]/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {csvData.length === 0 ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Arrastra tu archivo CSV aquí
                    </p>
                    <p className="text-gray-600 mb-4">
                      O haz clic para seleccionar un archivo
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Seleccionar Archivo
                    </Button>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                  <p className="text-lg font-semibold text-gray-900">
                    Archivo cargado exitosamente
                  </p>
                  <p className="text-gray-600">
                    {csvData.length} registros encontrados
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setCsvData([])
                      setPreview([])
                    }}
                  >
                    Seleccionar otro archivo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* CSV Format Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Formato esperado del CSV:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Columnas requeridas:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>nombre (obligatorio)</li>
                  <li>email (opcional)</li>
                  <li>telefono (opcional)</li>
                </ul>
              </div>
              <div>
                <strong>Columnas opcionales:</strong>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  <li>acompañantes (número)</li>
                  <li>mensaje</li>
                  <li>restricciones</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vista Previa</h4>
                <span className="text-sm text-gray-600">
                  Mostrando {preview.length} de {csvData.length} registros
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        {Object.values(row).map((value: unknown, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-sm text-gray-700"
                          >
                            {String(value) || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={csvData.length === 0 || isLoading}
            >
              {isLoading ? 'Importando...' : `Importar ${csvData.length} invitados`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
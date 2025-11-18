"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Check, X, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import type { Database } from "@/types/database.types";

type GuestInsert = Database['public']['Tables']['guests']['Insert'];

interface CSVRow {
  nombre?: string;
  name?: string;
  telefono?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  correo?: string;
  invitados?: string;
  guest_count?: string;
  guests?: string;
  mensaje?: string;
  message?: string;
  restricciones?: string;
  dietary_restrictions?: string;
  [key: string]: string | undefined;
}

interface ParsedGuest {
  name: string;
  phone: string;
  email?: string;
  guest_count: number;
  message?: string;
  dietary_restrictions?: string;
  isValid: boolean;
  errors: string[];
}

interface CSVImportDialogProps {
  eventId: string;
  onImport: (guests: GuestInsert[]) => Promise<void>;
}

export function CSVImportDialog({ eventId, onImport }: CSVImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([]);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const normalizePhone = (phone: string): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // If it starts with country code, keep it
    if (cleaned.startsWith('57')) {
      return `+${cleaned}`;
    }

    // If it's a 10-digit Colombian number, add country code
    if (cleaned.length === 10) {
      return `+57${cleaned}`;
    }

    // If it already has +, return as is
    if (phone.startsWith('+')) {
      return phone;
    }

    return `+${cleaned}`;
  };

  const parseCSV = useCallback((fileContent: string) => {
    Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        const guests: ParsedGuest[] = results.data.map((row) => {
          const errors: string[] = [];

          // Extract name (required)
          const name = row.nombre || row.name || '';
          if (!name.trim()) {
            errors.push('Nombre es requerido');
          }

          // Extract phone (required)
          const phone = row.telefono || row.phone || row.whatsapp || '';
          if (!phone.trim()) {
            errors.push('Teléfono es requerido');
          }

          // Extract email (optional)
          const email = row.email || row.correo || undefined;

          // Extract guest count (optional, default 1)
          const guestCountStr = row.invitados || row.guest_count || row.guests || '1';
          const guest_count = parseInt(guestCountStr) || 1;

          // Extract message (optional)
          const message = row.mensaje || row.message || undefined;

          // Extract dietary restrictions (optional)
          const dietary_restrictions = row.restricciones || row.dietary_restrictions || undefined;

          return {
            name: name.trim(),
            phone: phone.trim() ? normalizePhone(phone.trim()) : '',
            email: email?.trim(),
            guest_count,
            message: message?.trim(),
            dietary_restrictions: dietary_restrictions?.trim(),
            isValid: errors.length === 0,
            errors,
          };
        });

        setParsedGuests(guests);

        const validCount = guests.filter(g => g.isValid).length;
        const invalidCount = guests.length - validCount;

        if (invalidCount > 0) {
          toast.warning(`${validCount} invitados válidos, ${invalidCount} con errores`);
        } else {
          toast.success(`${validCount} invitados listos para importar`);
        }
      },
      error: (error: Error) => {
        toast.error(`Error al parsear CSV: ${error.message}`);
        console.error('CSV Parse Error:', error);
      },
    });
  }, []);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setParsedGuests([]);
      return;
    }

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Por favor selecciona un archivo CSV');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  }, [parseCSV]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleImport = async () => {
    const validGuests = parsedGuests.filter(g => g.isValid);

    if (validGuests.length === 0) {
      toast.error('No hay invitados válidos para importar');
      return;
    }

    setImporting(true);
    try {
      const guestsToInsert: GuestInsert[] = validGuests.map(guest => ({
        event_id: eventId,
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        guest_count: guest.guest_count,
        message: guest.message,
        dietary_restrictions: guest.dietary_restrictions,
        status: 'pending',
      }));

      await onImport(guestsToInsert);

      toast.success(`${validGuests.length} invitados importados exitosamente`);
      setOpen(false);
      setFile(null);
      setParsedGuests([]);
    } catch (error) {
      toast.error('Error al importar invitados');
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `nombre,telefono,email,invitados,mensaje,restricciones
Juan Pérez,+573001234567,juan@example.com,2,Confirmo asistencia,Vegetariano
María García,3002345678,maria@example.com,1,,Sin gluten
Pedro López,+573003456789,,,`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_invitados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Plantilla descargada');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Invitados desde CSV</DialogTitle>
          <DialogDescription>
            Carga un archivo CSV con los datos de tus invitados. El archivo debe tener columnas para nombre y teléfono.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={downloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar Plantilla
            </Button>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="csv-file"
              accept=".csv"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="csv-file"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                {file ? file.name : 'Arrastra un archivo CSV aquí o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-gray-500">
                Formato: nombre, telefono, email, invitados, mensaje, restricciones
              </p>
            </label>
          </div>

          {/* Preview Parsed Guests */}
          {parsedGuests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Vista Previa ({parsedGuests.filter(g => g.isValid).length} de {parsedGuests.length} válidos)
                </h3>
              </div>

              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-4 py-2 text-left">Teléfono</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Invitados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedGuests.map((guest, index) => (
                      <tr
                        key={index}
                        className={guest.isValid ? 'bg-white' : 'bg-red-50'}
                      >
                        <td className="px-4 py-2">
                          {guest.isValid ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <X className="h-4 w-4" />
                              <span className="text-xs">{guest.errors[0]}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">{guest.name || '-'}</td>
                        <td className="px-4 py-2">{guest.phone || '-'}</td>
                        <td className="px-4 py-2">{guest.email || '-'}</td>
                        <td className="px-4 py-2">{guest.guest_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Formato esperado:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>nombre</strong> o <strong>name</strong>: Nombre completo (requerido)</li>
                    <li><strong>telefono</strong>, <strong>phone</strong> o <strong>whatsapp</strong>: Número de teléfono (requerido)</li>
                    <li><strong>email</strong> o <strong>correo</strong>: Correo electrónico (opcional)</li>
                    <li><strong>invitados</strong>, <strong>guest_count</strong> o <strong>guests</strong>: Número de personas (opcional, default: 1)</li>
                    <li><strong>mensaje</strong> o <strong>message</strong>: Mensaje adicional (opcional)</li>
                    <li><strong>restricciones</strong> o <strong>dietary_restrictions</strong>: Restricciones alimentarias (opcional)</li>
                  </ul>
                </div>
              </div>

              {/* Import Button */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setParsedGuests([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || parsedGuests.filter(g => g.isValid).length === 0}
                  className="gap-2"
                >
                  {importing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Importar {parsedGuests.filter(g => g.isValid).length} Invitados
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

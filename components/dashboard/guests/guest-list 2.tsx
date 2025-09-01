'use client'

import { useState } from "react"
import { Guest } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { getGuestStatusColor } from "@/lib/utils"

interface GuestListProps {
  guests: Guest[]
  onEdit?: (guest: Guest) => void
  onDelete?: (guestId: string) => void
  onSendReminder?: (guestId: string) => void
}

export function GuestList({ 
  guests, 
  onEdit, 
  onDelete, 
  onSendReminder 
}: GuestListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'declined':
        return 'Declinó'
      default:
        return 'Pendiente'
    }
  }

  if (guests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay invitados
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Agrega invitados manualmente o importa desde un archivo CSV
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar invitados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todos ({guests.length})
          </Button>
          <Button 
            variant={statusFilter === 'confirmed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmados ({guests.filter(g => g.status === 'confirmed').length})
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            Pendientes ({guests.filter(g => g.status === 'pending').length})
          </Button>
          <Button 
            variant={statusFilter === 'declined' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter('declined')}
          >
            Declinaron ({guests.filter(g => g.status === 'declined').length})
          </Button>
        </div>
      </div>

      {/* Guest List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Invitados ({filteredGuests.length})</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredGuests.map((guest) => (
              <div 
                key={guest.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {guest.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        {guest.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {guest.email}
                          </div>
                        )}
                        {guest.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {guest.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {guest.guest_count} {guest.guest_count === 1 ? 'persona' : 'personas'}
                        </div>
                      </div>
                      {guest.message && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          &ldquo;{guest.message}&rdquo;
                        </p>
                      )}
                      {guest.dietary_restrictions && (
                        <p className="text-sm text-orange-600 mt-1">
                          <strong>Restricciones:</strong> {guest.dietary_restrictions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(guest.status)}
                    <Badge className={getGuestStatusColor(guest.status)}>
                      {getStatusLabel(guest.status)}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onEdit?.(guest)}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      {guest.status === 'pending' && (
                        <DropdownMenuItem 
                          onClick={() => onSendReminder?.(guest.id)}
                          className="cursor-pointer"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar recordatorio
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(guest.id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredGuests.length === 0 && guests.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No se encontraron invitados con los filtros seleccionados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
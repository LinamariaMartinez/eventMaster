"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TopEventsTableProps {
  events: Array<{
    name: string
    guests: number
    confirmed: number
    declined: number
    pending: number
    responseRate: number
  }>
}

export function TopEventsTable({ events }: TopEventsTableProps) {
  const sortedEvents = [...events].sort((a, b) => b.responseRate - a.responseRate)

  const getResponseRateBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    if (rate >= 80) return <Badge className="bg-blue-100 text-blue-800">Muy Bueno</Badge>
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Bueno</Badge>
    return <Badge variant="destructive">Mejorable</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Eventos con Mejor Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead className="text-center">Invitados</TableHead>
              <TableHead className="text-center">Confirmados</TableHead>
              <TableHead className="text-center">Tasa de Respuesta</TableHead>
              <TableHead className="text-center">Rendimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map((event, index) => (
              <TableRow key={event.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    <span>{event.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{event.guests}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{event.confirmed}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round((event.confirmed / event.guests) * 100)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {event.responseRate >= 85 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">{event.responseRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{getResponseRateBadge(event.responseRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

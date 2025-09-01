"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Clock, HelpCircle } from "lucide-react"

interface GuestStatsProps {
  stats: {
    total: number
    confirmed: number
    pending: number
    declined: number
    maybe: number
  }
}

export function GuestStats({ stats }: GuestStatsProps) {
  const confirmationRate = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0
  const responseRate =
    stats.total > 0 ? Math.round(((stats.confirmed + stats.declined + stats.maybe) / stats.total) * 100) : 0

  const statCards = [
    {
      label: "Total Invitados",
      value: stats.total,
      icon: Users,
      color: "text-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Confirmados",
      value: stats.confirmed,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Rechazados",
      value: stats.declined,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Tal vez",
      value: stats.maybe,
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            Tasa de Confirmación: {confirmationRate}%
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-blue-200 text-blue-800">
            Tasa de Respuesta: {responseRate}%
          </Badge>
        </div>
      </div>
    </div>
  )
}

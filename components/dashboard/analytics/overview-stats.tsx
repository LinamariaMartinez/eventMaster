"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Mail, TrendingUp, CheckCircle, Clock, type LucideIcon } from "lucide-react"

interface OverviewStatsProps {
  stats: {
    totalEvents: number
    totalGuests: number
    totalInvitations: number
    avgResponseRate: number
    avgConfirmationRate: number
    activeEvents: number
    completedEvents: number
    upcomingEvents: number
  }
}

type ChangeType = "positive" | "negative" | "neutral";

export function OverviewStats({ stats }: OverviewStatsProps) {
  const statCards: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    change: string;
    changeType: ChangeType;
  }> = [
    {
      label: "Total Eventos",
      value: stats.totalEvents,
      icon: CalendarDays,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      label: "Total Invitados",
      value: stats.totalGuests.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+23%",
      changeType: "positive",
    },
    {
      label: "Invitaciones Enviadas",
      value: stats.totalInvitations.toLocaleString(),
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+18%",
      changeType: "positive",
    },
    {
      label: "Tasa de Respuesta",
      value: `${stats.avgResponseRate}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%",
      changeType: "positive",
    },
    {
      label: "Tasa de Confirmación",
      value: `${stats.avgConfirmationRate}%`,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+3%",
      changeType: "positive",
    },
    {
      label: "Eventos Activos",
      value: stats.activeEvents,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "2 nuevos",
      changeType: "neutral",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <Badge
                variant={stat.changeType === "positive" ? "default" : "secondary"}
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "bg-green-100 text-green-800"
                    : stat.changeType === "negative"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

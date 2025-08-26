"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

interface EventPerformanceChartProps {
  events: Array<{
    name: string
    guests: number
    confirmed: number
    declined: number
    pending: number
    responseRate: number
  }>
}

const chartConfig = {
  confirmed: {
    label: "Confirmados",
    color: "#22c55e",
  },
  declined: {
    label: "Rechazados",
    color: "#ef4444",
  },
  pending: {
    label: "Pendientes",
    color: "#f59e0b",
  },
}

export function EventPerformanceChart({ events }: EventPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Rendimiento por Evento</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={events} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="confirmed" fill={chartConfig.confirmed.color} name={chartConfig.confirmed.label} />
              <Bar dataKey="declined" fill={chartConfig.declined.color} name={chartConfig.declined.label} />
              <Bar dataKey="pending" fill={chartConfig.pending.color} name={chartConfig.pending.label} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

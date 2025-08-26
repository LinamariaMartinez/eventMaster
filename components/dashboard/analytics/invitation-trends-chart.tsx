"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

interface InvitationTrendsChartProps {
  data: Array<{
    month: string
    invitations: number
    responses: number
    confirmations: number
  }>
}

const chartConfig = {
  invitations: {
    label: "Invitaciones",
    color: "#8b1538",
  },
  responses: {
    label: "Respuestas",
    color: "#3b82f6",
  },
  confirmations: {
    label: "Confirmaciones",
    color: "#22c55e",
  },
}

export function InvitationTrendsChart({ data }: InvitationTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Tendencias de Invitaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="invitations"
                stroke={chartConfig.invitations.color}
                strokeWidth={2}
                name={chartConfig.invitations.label}
              />
              <Line
                type="monotone"
                dataKey="responses"
                stroke={chartConfig.responses.color}
                strokeWidth={2}
                name={chartConfig.responses.label}
              />
              <Line
                type="monotone"
                dataKey="confirmations"
                stroke={chartConfig.confirmations.color}
                strokeWidth={2}
                name={chartConfig.confirmations.label}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

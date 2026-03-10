'use client'

import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Dot,
} from 'recharts'
import { getGlucoseStatus } from '@/lib/utils'

interface GlucoseReading {
  id: string
  value: number
  measured_at: string
  moment: string
}

interface GlucoseChartProps {
  readings: GlucoseReading[]
}

const PERIODS = [
  { label: '7 dias', days: 7 },
  { label: '14 dias', days: 14 },
  { label: '30 dias', days: 30 },
]

function getDotColor(value: number): string {
  const status = getGlucoseStatus(value)
  if (status === 'normal') return '#16a34a'
  if (status === 'warning') return '#ea580c'
  return '#dc2626'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload } = props
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={4}
      fill={getDotColor(payload.value)}
      stroke="white"
      strokeWidth={1.5}
    />
  )
}

export function GlucoseChart({ readings }: GlucoseChartProps) {
  const [days, setDays] = useState(7)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const data = readings
    .filter((r) => new Date(r.measured_at) >= cutoff)
    .reverse()
    .map((r) => ({
      value: r.value,
      date: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(r.measured_at)),
    }))

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-500">
        Sem dados no período selecionado
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3" role="img" aria-label={`Gráfico de tendência de glicemia — ${data.length} medições nos últimos ${days} dias`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{data.length} medições</p>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                days === p.days
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value) => [`${value} mg/dL`, 'Glicemia']}
          />
          {/* Faixas de referência */}
          <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="4 3" label={{ value: '70', fontSize: 12, fill: '#dc2626' }} />
          <ReferenceLine y={180} stroke="#ea580c" strokeDasharray="4 3" label={{ value: '180', fontSize: 12, fill: '#ea580c' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-600" /> Normal (70–180)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-600" /> Atenção (180–250)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600" /> Crítico</span>
      </div>
    </div>
  )
}

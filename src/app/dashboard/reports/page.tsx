import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { getGlucoseStatus, formatDateTime, momentLabels } from '@/lib/utils'
import { ReportDownloadButton } from './ReportDownloadButton'

const PERIODS = [
  { label: 'Últimos 7 dias', days: 7 },
  { label: 'Últimos 14 dias', days: 14 },
  { label: 'Últimos 30 dias', days: 30 },
]

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const { days: daysParam } = await searchParams
  const days = Number(daysParam) || 30

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const [{ data: readings }, { data: doses }] = await Promise.all([
    supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', user!.id)
      .gte('measured_at', cutoff.toISOString())
      .order('measured_at', { ascending: false }),
    supabase
      .from('insulin_doses')
      .select('*')
      .eq('user_id', user!.id)
      .gte('taken_at', cutoff.toISOString())
      .order('taken_at', { ascending: false }),
  ])

  const values = (readings ?? []).map((r) => r.value)
  const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null
  const min = values.length ? Math.min(...values) : null
  const max = values.length ? Math.max(...values) : null
  const inRange = values.filter((v) => v >= 70 && v <= 180).length
  const pct = values.length ? Math.round((inRange / values.length) * 100) : null

  const period = PERIODS.find((p) => p.days === days)?.label ?? `Últimos ${days} dias`

  const reportData = {
    period,
    readings: readings ?? [],
    doses: doses ?? [],
    userEmail: user!.email ?? '',
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Resumo dos dados para consulta médica</p>
      </div>

      {/* Seletor de período */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <a
            key={p.days}
            href={`/dashboard/reports?days=${p.days}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              days === p.days
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </a>
        ))}
      </div>

      {values.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum dado no período selecionado.</p>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Média', value: avg, unit: 'mg/dL', status: avg },
              { label: 'Mínimo', value: min, unit: 'mg/dL', status: min },
              { label: 'Máximo', value: max, unit: 'mg/dL', status: max },
              { label: 'No alvo (70–180)', value: `${pct}%`, unit: `${inRange}/${values.length} medições`, status: null },
            ].map((stat) => {
              const colorClass = stat.status
                ? getGlucoseStatus(stat.status) === 'normal' ? 'text-green-600'
                  : getGlucoseStatus(stat.status) === 'warning' ? 'text-orange-600'
                  : 'text-red-600'
                : 'text-gray-900'
              return (
                <Card key={stat.label} padding="sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{stat.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${colorClass}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.unit}</p>
                </Card>
              )
            })}
          </div>

          {/* Preview + botão de download */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Medições — {period}
              </h2>
              <ReportDownloadButton data={reportData} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase text-gray-500">
                    <th className="pb-2 pr-4">Data/Hora</th>
                    <th className="pb-2 pr-4">Valor</th>
                    <th className="pb-2 pr-4">Momento</th>
                    <th className="pb-2">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {(readings ?? []).slice(0, 20).map((r) => {
                    const s = getGlucoseStatus(r.value)
                    const color = s === 'normal' ? 'text-green-600' : s === 'warning' ? 'text-orange-600' : 'text-red-600'
                    return (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-600">{formatDateTime(r.measured_at)}</td>
                        <td className={`py-2 pr-4 font-semibold ${color}`}>{r.value} mg/dL</td>
                        <td className="py-2 pr-4 text-gray-600">{momentLabels[r.moment] ?? r.moment}</td>
                        <td className="py-2 text-gray-500 italic">{r.notes ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {(readings ?? []).length > 20 && (
                <p className="mt-2 text-xs text-gray-500">
                  Mostrando 20 de {readings!.length} registros. O PDF inclui todos.
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

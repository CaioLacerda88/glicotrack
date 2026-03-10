import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { getGlucoseColorClass, getGlucoseLabel, getGlucoseStatus, formatDateTime, momentLabels, insulinTypeLabels } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Busca última medição de glicemia
  const { data: lastGlucose } = await supabase
    .from('glucose_readings')
    .select('*')
    .eq('user_id', user!.id)
    .order('measured_at', { ascending: false })
    .limit(1)
    .single()

  // Busca total de medições de hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: todayCount } = await supabase
    .from('glucose_readings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .gte('measured_at', today.toISOString())

  // Busca última dose de insulina
  const { data: lastInsulin } = await supabase
    .from('insulin_doses')
    .select('*')
    .eq('user_id', user!.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  const glucoseStatus = lastGlucose ? getGlucoseStatus(lastGlucose.value) : null
  const isCritical = glucoseStatus === 'critical-low' || glucoseStatus === 'critical-high'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumo do seu dia</p>
      </div>

      {/* Alerta crítico de glicemia */}
      {isCritical && lastGlucose && (
        <div className={`mb-6 flex items-start gap-3 rounded-xl border-2 p-4 ${
          glucoseStatus === 'critical-low'
            ? 'border-red-500 bg-red-50'
            : 'border-orange-500 bg-orange-50'
        }`}>
          <span className="text-2xl">⚠️</span>
          <div>
            <p className={`font-semibold ${glucoseStatus === 'critical-low' ? 'text-red-800' : 'text-orange-800'}`}>
              {glucoseStatus === 'critical-low'
                ? 'Hipoglicemia detectada!'
                : 'Hiperglicemia grave detectada!'}
            </p>
            <p className={`text-sm ${glucoseStatus === 'critical-low' ? 'text-red-700' : 'text-orange-700'}`}>
              Última medição: <strong>{lastGlucose.value} mg/dL</strong> ({formatDateTime(lastGlucose.measured_at)})
            </p>
            <p className={`mt-1 text-sm ${glucoseStatus === 'critical-low' ? 'text-red-600' : 'text-orange-600'}`}>
              {glucoseStatus === 'critical-low'
                ? 'Valores abaixo de 70 mg/dL requerem atenção imediata. Consulte seu médico.'
                : 'Valores acima de 250 mg/dL requerem atenção. Consulte seu médico.'}
            </p>
          </div>
        </div>
      )}

      {/* Cards de resumo — clicáveis */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Última glicemia */}
        <Link href="/dashboard/glucose" className="block">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Última glicemia</p>
            {lastGlucose ? (
              <>
                <p className={`mt-2 text-4xl font-bold ${getGlucoseColorClass(lastGlucose.value)}`}>
                  {lastGlucose.value} <span className="text-base font-normal">mg/dL</span>
                </p>
                <p className={`mt-1 text-sm font-medium ${getGlucoseColorClass(lastGlucose.value)}`}>
                  {getGlucoseLabel(lastGlucose.value)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {momentLabels[lastGlucose.moment]} · {formatDateTime(lastGlucose.measured_at)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Nenhuma medição registrada</p>
            )}
          </Card>
        </Link>

        {/* Medições hoje */}
        <Link href="/dashboard/glucose" className="block">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Medições hoje</p>
            <p className="mt-2 text-4xl font-bold text-gray-900">{todayCount ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">registros de glicemia</p>
          </Card>
        </Link>

        {/* Última insulina */}
        <Link href="/dashboard/insulin" className="block">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Última insulina</p>
            {lastInsulin ? (
              <>
                <p className="mt-2 text-4xl font-bold text-gray-900">
                  {lastInsulin.units} <span className="text-base font-normal">UI</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">{insulinTypeLabels[lastInsulin.type] ?? lastInsulin.type}</p>
                <p className="mt-0.5 text-xs text-gray-400">{formatDateTime(lastInsulin.taken_at)}</p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">Nenhuma dose registrada</p>
            )}
          </Card>
        </Link>
      </div>

      {/* Ações rápidas — todas as 5 categorias */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Registro rápido</h2>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <Link
            href="/dashboard/glucose"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            🩸 Glicemia
          </Link>
          <Link
            href="/dashboard/insulin"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            💉 Insulina
          </Link>
          <Link
            href="/dashboard/meals"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            🍽️ Refeição
          </Link>
          <Link
            href="/dashboard/activities"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            🏃 Atividade
          </Link>
          <Link
            href="/dashboard/symptoms"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors col-span-2 sm:col-span-1"
          >
            🤒 Sintomas
          </Link>
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import {
  getGlucoseColorClass,
  getGlucoseBgClass,
  getGlucoseLabel,
  getGlucoseStatus,
  formatDateTime,
  momentLabels,
} from '@/lib/utils'
import { GlucoseForm } from './GlucoseForm'
import { DeleteGlucoseButton } from './DeleteGlucoseButton'
import { GlucoseChart } from '@/components/charts/GlucoseChart'

export default async function GlucosePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: readings } = await supabase
    .from('glucose_readings')
    .select('*')
    .eq('user_id', user!.id)
    .order('measured_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Glicemia</h1>
        <p className="text-sm text-gray-500">Registre e acompanhe suas medições</p>
      </div>

      {/* Legenda de faixas */}
      <div className="flex flex-wrap gap-3 text-xs font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Hipoglicemia &lt; 70
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" /> Normal 70–180
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-orange-700">
          <span className="h-2 w-2 rounded-full bg-orange-500" /> Atenção 180–250
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-600" /> Hiperglicemia &gt; 250
        </span>
      </div>

      {/* Gráfico de tendência */}
      {readings && readings.length > 1 && (
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Tendência</h2>
          <GlucoseChart readings={readings} />
        </Card>
      )}

      {/* Formulário de registro */}
      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Nova medição</h2>
        <GlucoseForm />
      </Card>

      {/* Histórico */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Histórico{' '}
          <span className="text-sm font-normal text-gray-500">
            ({readings?.length ?? 0} registros)
          </span>
        </h2>

        {!readings || readings.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma medição registrada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {readings.map((reading) => {
              const isCritical =
                getGlucoseStatus(reading.value) === 'critical-low' ||
                getGlucoseStatus(reading.value) === 'critical-high'

              return (
                <li
                  key={reading.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${getGlucoseBgClass(reading.value)}`}
                >
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getGlucoseColorClass(reading.value)}`}>
                          {reading.value}
                        </span>
                        <span className="text-sm text-gray-500">mg/dL</span>
                        {isCritical && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            ⚠ {getGlucoseLabel(reading.value)}
                          </span>
                        )}
                        {!isCritical && (
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getGlucoseColorClass(reading.value)} bg-white/60`}>
                            {getGlucoseLabel(reading.value)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {momentLabels[reading.moment]} · {formatDateTime(reading.measured_at)}
                      </p>
                      {reading.notes && (
                        <p className="mt-1 text-sm text-gray-500 italic">{reading.notes}</p>
                      )}
                    </div>
                  </div>

                  <DeleteGlucoseButton id={reading.id} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

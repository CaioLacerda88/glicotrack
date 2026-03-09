import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { formatDateTime, intensityLabels } from '@/lib/utils'
import { ActivityForm } from './ActivityForm'
import { deleteActivity } from './actions'

const intensityColors: Record<string, string> = {
  low: 'bg-green-50 border-green-200 text-green-700',
  moderate: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-red-50 border-red-200 text-red-700',
}

export default async function ActivitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user!.id)
    .order('performed_at', { ascending: false })
    .limit(50)

  // Minutos de atividade hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayActivities } = await supabase
    .from('activities')
    .select('duration_minutes')
    .eq('user_id', user!.id)
    .gte('performed_at', today.toISOString())

  const todayMinutes = todayActivities?.reduce((sum, a) => sum + a.duration_minutes, 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Atividades Físicas</h1>
        <p className="text-sm text-gray-500">Exercícios afetam a glicemia — registre para entender os padrões</p>
      </div>

      {todayMinutes > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <span className="text-2xl">🏃</span>
          <div>
            <p className="text-sm font-semibold text-green-800">{todayMinutes} minutos de atividade hoje</p>
            <p className="text-xs text-green-600">{todayActivities?.length} sessão{todayActivities!.length !== 1 ? 'ões' : ''}</p>
          </div>
        </div>
      )}

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Nova atividade</h2>
        <ActivityForm />
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Histórico{' '}
          <span className="text-sm font-normal text-gray-500">({activities?.length ?? 0} registros)</span>
        </h2>

        {!activities || activities.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma atividade registrada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{activity.type}</p>
                    <span className="text-sm text-gray-500">{activity.duration_minutes} min</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${intensityColors[activity.intensity] ?? 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      {intensityLabels[activity.intensity] ?? activity.intensity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{formatDateTime(activity.performed_at)}</p>
                  {activity.notes && <p className="mt-1 text-sm text-gray-500 italic">{activity.notes}</p>}
                </div>
                <DeleteButton
                  onDelete={() => deleteActivity(activity.id)}
                  confirmMessage="Remover esta atividade?"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

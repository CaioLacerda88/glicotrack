import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { formatDateTime, insulinTypeLabels } from '@/lib/utils'
import { InsulinForm } from './InsulinForm'
import { DeleteInsulinButton } from './DeleteInsulinButton'

const typeColors: Record<string, string> = {
  fast: 'bg-blue-50 border-blue-200 text-blue-700',
  ultra_fast: 'bg-purple-50 border-purple-200 text-purple-700',
  slow: 'bg-amber-50 border-amber-200 text-amber-700',
  mixed: 'bg-teal-50 border-teal-200 text-teal-700',
}

export default async function InsulinPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: doses } = await supabase
    .from('insulin_doses')
    .select('*')
    .eq('user_id', user!.id)
    .order('taken_at', { ascending: false })
    .limit(50)

  // Total de unidades hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayDoses } = await supabase
    .from('insulin_doses')
    .select('units')
    .eq('user_id', user!.id)
    .gte('taken_at', today.toISOString())

  const todayTotal = todayDoses?.reduce((sum, d) => sum + Number(d.units), 0) ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Insulina</h1>
        <p className="text-sm text-gray-500">Registre e acompanhe suas doses</p>
      </div>

      {/* Resumo do dia */}
      {todayTotal > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <span className="text-2xl">💉</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">
              {todayTotal} unidades aplicadas hoje
            </p>
            <p className="text-xs text-blue-600">{todayDoses?.length} dose{todayDoses!.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Legenda de tipos */}
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {Object.entries(insulinTypeLabels).map(([key, label]) => (
          <span key={key} className={`inline-flex items-center rounded-full border px-3 py-1 ${typeColors[key]}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Formulário */}
      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Nova dose</h2>
        <InsulinForm />
      </Card>

      {/* Histórico */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Histórico{' '}
          <span className="text-sm font-normal text-gray-500">
            ({doses?.length ?? 0} registros)
          </span>
        </h2>

        {!doses || doses.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma dose registrada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {doses.map((dose) => (
              <li
                key={dose.id}
                className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${typeColors[dose.type] ?? 'bg-gray-50 border-gray-200'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {dose.units}
                    </span>
                    <span className="text-sm text-gray-500">UI</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${typeColors[dose.type]}`}>
                      {insulinTypeLabels[dose.type] ?? dose.type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600">{formatDateTime(dose.taken_at)}</p>
                  {dose.notes && (
                    <p className="mt-1 text-sm text-gray-500 italic">{dose.notes}</p>
                  )}
                </div>

                <DeleteInsulinButton id={dose.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

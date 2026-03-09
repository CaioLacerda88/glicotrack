import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { formatDateTime } from '@/lib/utils'
import { SymptomForm } from './SymptomForm'
import { deleteSymptom } from './actions'

export default async function SymptomsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .eq('user_id', user!.id)
    .order('occurred_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Sintomas</h1>
        <p className="text-sm text-gray-500">Registre sintomas para identificar padrões ligados à glicemia</p>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Registrar sintomas</h2>
        <SymptomForm />
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Histórico{' '}
          <span className="text-sm font-normal text-gray-500">({symptoms?.length ?? 0} registros)</span>
        </h2>

        {!symptoms || symptoms.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum sintoma registrado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {symptoms.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {(entry.items as string[]).map((item) => (
                      <span key={item} className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{formatDateTime(entry.occurred_at)}</p>
                  {entry.notes && <p className="mt-1 text-sm text-gray-500 italic">{entry.notes}</p>}
                </div>
                <DeleteButton
                  onDelete={() => deleteSymptom(entry.id)}
                  confirmMessage="Remover este registro de sintomas?"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

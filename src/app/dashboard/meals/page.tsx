import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { formatDateTime, mealCategoryLabels } from '@/lib/utils'
import { MealForm } from './MealForm'
import { deleteMeal } from './actions'

const categoryColors: Record<string, string> = {
  breakfast: 'bg-yellow-50 border-yellow-200',
  lunch: 'bg-orange-50 border-orange-200',
  dinner: 'bg-indigo-50 border-indigo-200',
  snack: 'bg-green-50 border-green-200',
}

const categoryEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

export default async function MealsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: meals } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user!.id)
    .order('eaten_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Refeições</h1>
        <p className="text-sm text-gray-500">Registre o que você come para correlacionar com a glicemia</p>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">Nova refeição</h2>
        <MealForm />
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Histórico{' '}
          <span className="text-sm font-normal text-gray-500">({meals?.length ?? 0} registros)</span>
        </h2>

        {!meals || meals.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma refeição registrada ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {meals.map((meal) => (
              <li
                key={meal.id}
                className={`flex items-start justify-between gap-3 rounded-xl border p-4 ${categoryColors[meal.category] ?? 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{categoryEmoji[meal.category] ?? '🍽️'}</span>
                  <div>
                    <p className="font-medium text-gray-900">{meal.description}</p>
                    <p className="text-sm text-gray-500">
                      {mealCategoryLabels[meal.category] ?? meal.category} · {formatDateTime(meal.eaten_at)}
                    </p>
                    {meal.notes && <p className="mt-1 text-sm text-gray-500 italic">{meal.notes}</p>}
                  </div>
                </div>
                <DeleteButton
                  onDelete={() => deleteMeal(meal.id)}
                  confirmMessage="Remover esta refeição?"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

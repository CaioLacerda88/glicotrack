'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addMeal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const eaten_at = formData.get('eaten_at') as string
  const notes = formData.get('notes') as string

  if (!description?.trim()) return { error: 'Descreva a refeição.' }

  const { error } = await supabase.from('meals').insert({
    user_id: user.id,
    description: description.trim(),
    category,
    notes: notes || null,
    eaten_at: eaten_at || new Date().toISOString(),
  })

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/meals')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMeal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao deletar.' }

  revalidatePath('/dashboard/meals')
  revalidatePath('/dashboard')
  return { success: true }
}

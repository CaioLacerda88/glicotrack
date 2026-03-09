'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addSymptom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const items = formData.getAll('items') as string[]
  const occurred_at = formData.get('occurred_at') as string
  const notes = formData.get('notes') as string

  if (items.length === 0) return { error: 'Selecione pelo menos um sintoma.' }

  const { error } = await supabase.from('symptoms').insert({
    user_id: user.id,
    items,
    notes: notes || null,
    occurred_at: occurred_at || new Date().toISOString(),
  })

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/symptoms')
  return { success: true }
}

export async function deleteSymptom(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('symptoms')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao deletar.' }

  revalidatePath('/dashboard/symptoms')
  return { success: true }
}

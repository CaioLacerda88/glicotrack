'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addActivity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const type = formData.get('type') as string
  const duration_minutes = Number(formData.get('duration_minutes'))
  const intensity = formData.get('intensity') as string
  const performed_at = formData.get('performed_at') as string
  const notes = formData.get('notes') as string

  if (!type?.trim()) return { error: 'Informe o tipo de atividade.' }
  if (!duration_minutes || duration_minutes < 1) return { error: 'Informe a duração em minutos.' }

  const { error } = await supabase.from('activities').insert({
    user_id: user.id,
    type: type.trim(),
    duration_minutes,
    intensity,
    notes: notes || null,
    performed_at: performed_at || new Date().toISOString(),
  })

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/activities')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao deletar.' }

  revalidatePath('/dashboard/activities')
  revalidatePath('/dashboard')
  return { success: true }
}

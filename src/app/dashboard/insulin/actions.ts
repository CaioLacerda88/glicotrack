'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addInsulinDose(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const units = Number(formData.get('units'))
  const type = formData.get('type') as string
  const taken_at = formData.get('taken_at') as string
  const notes = formData.get('notes') as string

  if (!units || units <= 0 || units > 200) {
    return { error: 'Dose inválida. Use um valor entre 0,5 e 200 unidades.' }
  }

  const { error } = await supabase.from('insulin_doses').insert({
    user_id: user.id,
    units,
    type,
    notes: notes || null,
    taken_at: taken_at || new Date().toISOString(),
  })

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/insulin')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteInsulinDose(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('insulin_doses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao deletar.' }

  revalidatePath('/dashboard/insulin')
  revalidatePath('/dashboard')
  return { success: true }
}

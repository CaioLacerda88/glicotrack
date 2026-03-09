'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addGlucoseReading(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const value = Number(formData.get('value'))
  const moment = formData.get('moment') as string
  const measured_at = formData.get('measured_at') as string
  const notes = formData.get('notes') as string

  if (!value || value < 20 || value > 600) {
    return { error: 'Valor inválido. Use entre 20 e 600 mg/dL.' }
  }

  const { error } = await supabase.from('glucose_readings').insert({
    user_id: user.id,
    value,
    moment,
    notes: notes || null,
    measured_at: measured_at || new Date().toISOString(),
  })

  if (error) return { error: 'Erro ao salvar. Tente novamente.' }

  revalidatePath('/dashboard/glucose')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteGlucoseReading(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('glucose_readings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao deletar.' }

  revalidatePath('/dashboard/glucose')
  revalidatePath('/dashboard')
  return { success: true }
}

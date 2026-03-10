'use client'

import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addActivity } from './actions'

const intensityOptions = [
  { value: 'low', label: 'Leve (caminhada, alongamento)' },
  { value: 'moderate', label: 'Moderada (corrida leve, ciclismo)' },
  { value: 'high', label: 'Intensa (HIIT, musculação pesada)' },
]

const activitySuggestions = ['Caminhada', 'Corrida', 'Ciclismo', 'Natação', 'Musculação', 'Yoga', 'Futebol']

function nowLocalISO() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function ActivityForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await addActivity(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        formRef.current?.reset()
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Input
            label="Tipo de atividade"
            name="type"
            type="text"
            placeholder="Ex: Caminhada, Corrida..."
            list="activity-suggestions"
            required
          />
          <datalist id="activity-suggestions">
            {activitySuggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>

        <Input
          label="Duração (minutos)"
          name="duration_minutes"
          type="number"
          min={1}
          max={600}
          placeholder="Ex: 30"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="intensity" className="text-sm font-medium text-gray-700">Intensidade</label>
        <select
          id="intensity"
          name="intensity"
          defaultValue="moderate"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          {intensityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Input
        label="Data e hora"
        name="performed_at"
        type="datetime-local"
        defaultValue={nowLocalISO()}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Observações <span className="text-gray-500 font-normal">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Ex: senti hipoglicemia durante, precisei parar..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Atividade registrada!</p>}

      <Button type="submit" loading={isPending} className="w-full sm:w-auto">Salvar atividade</Button>
    </form>
  )
}

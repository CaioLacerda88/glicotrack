'use client'

import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addGlucoseReading } from './actions'

const momentOptions = [
  { value: 'fasting', label: 'Jejum' },
  { value: 'pre_meal', label: 'Pré-refeição' },
  { value: 'post_meal', label: 'Pós-refeição' },
  { value: 'bedtime', label: 'Antes de dormir' },
]

// Retorna a data/hora atual no formato esperado pelo input datetime-local
function nowLocalISO() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function GlucoseForm() {
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
      const result = await addGlucoseReading(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        formRef.current?.reset()
        // Remove o feedback de sucesso após 3 segundos
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Glicemia (mg/dL)"
          name="value"
          type="number"
          min={20}
          max={600}
          placeholder="Ex: 120"
          required
          autoFocus
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="moment" className="text-sm font-medium text-gray-700">
            Momento
          </label>
          <select
            id="moment"
            name="moment"
            required
            defaultValue="fasting"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {momentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Data e hora da medição"
        name="measured_at"
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
          placeholder="Ex: após o almoço, senti tontura..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Medição registrada com sucesso!</p>
      )}

      <Button type="submit" loading={isPending} className="w-full sm:w-auto">
        Salvar medição
      </Button>
    </form>
  )
}

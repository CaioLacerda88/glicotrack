'use client'

import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { addSymptom } from './actions'

const SYMPTOM_LIST = [
  'Tontura', 'Sudorese', 'Tremores', 'Visão turva', 'Fraqueza',
  'Dor de cabeça', 'Náusea', 'Palpitações', 'Sede excessiva',
  'Urinar frequentemente', 'Fadiga', 'Irritabilidade', 'Confusão mental',
]

function nowLocalISO() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function SymptomForm() {
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
      const result = await addSymptom(formData)
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
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">Sintomas <span className="text-gray-500 font-normal">(selecione todos que sentir)</span></p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SYMPTOM_LIST.map((symptom) => (
            <label key={symptom} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 transition-colors">
              <input type="checkbox" name="items" value={symptom} className="accent-blue-600" />
              {symptom}
            </label>
          ))}
        </div>
      </div>

      <Input
        label="Data e hora"
        name="occurred_at"
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
          placeholder="Ex: sintomas apareceram após o exercício..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Sintomas registrados!</p>}

      <Button type="submit" loading={isPending} className="w-full sm:w-auto">Salvar sintomas</Button>
    </form>
  )
}

'use client'

// Botão de deletar reutilizável — recebe a server action via prop
import { useTransition } from 'react'

interface DeleteButtonProps {
  onDelete: () => Promise<unknown>
  confirmMessage?: string
  label?: string
}

export function DeleteButton({ onDelete, confirmMessage = 'Remover este registro?', label }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(confirmMessage)) return
    startTransition(async () => { await onDelete() })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      aria-label={label ?? 'Remover'}
      className="shrink-0 rounded-lg p-2.5 text-gray-600 hover:bg-white/70 hover:text-red-600 transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
    >
      {isPending ? (
        <svg aria-hidden="true" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  )
}

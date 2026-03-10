'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('Não foi possível criar a conta. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">✉️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Confirme seu email</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enviamos um link de confirmação para <strong>{email}</strong>.
            Acesse sua caixa de entrada e clique no link para ativar sua conta.
          </p>
          <Link href="/login" className="mt-6 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GlicoTrack</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monitoramento de glicemia</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-gray-100">Criar conta</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1">
              Criar conta
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

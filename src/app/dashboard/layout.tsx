'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/glucose', label: 'Glicemia', icon: '🩸' },
  { href: '/dashboard/insulin', label: 'Insulina', icon: '💉' },
  { href: '/dashboard/meals', label: 'Refeições', icon: '🍽️' },
  { href: '/dashboard/activities', label: 'Atividades', icon: '🏃' },
  { href: '/dashboard/symptoms', label: 'Sintomas', icon: '🤒' },
  { href: '/dashboard/reports', label: 'Relatórios', icon: '📄' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar — visível apenas no desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex h-16 items-center gap-3 px-5 border-b border-gray-200 dark:border-gray-700">
          <Logo size="sm" />
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">GlicoTrack</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                      }`}
                  >
                    <span aria-hidden="true" className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-1">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <span aria-hidden="true">🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* Topbar — visível apenas no mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-base font-bold text-gray-900 dark:text-gray-100">GlicoTrack</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg dark:text-gray-400 dark:hover:text-gray-100"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/30" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-gray-100">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu" className="p-2 text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg dark:text-gray-400"><span aria-hidden="true">✕</span></button>
            </div>
            <nav className="p-3">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                          ${isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                          }`}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <span aria-hidden="true">🚪</span> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Área de conteúdo principal */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from './ConfirmDialog'
import { useAuth } from '../contexts/useAuth'

const navItems = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/library', label: 'Libreria' },
  { to: '/app/favorites', label: 'Preferiti' },
  { to: '/app/statistics', label: 'Statistiche' },
  { to: '/app/profile', label: 'Profilo' },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function handleConfirmLogout() {
    setShowLogoutConfirm(false)
    await logout()
    navigate('/')
  }

  useEffect(() => {
    if (!isMenuOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY
      const scrolledPastThreshold = currentScrollY > 64

      if (currentScrollY > lastScrollY.current && scrolledPastThreshold) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra superiore, visibile solo su mobile/tablet. Si nasconde scorrendo verso il basso, riappare scorrendo verso l'alto. */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 transition-transform duration-300 ease-out md:hidden ${
          isHeaderVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <p className="text-lg font-bold text-emerald-600">📚 BookTrack</p>
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Apri menu"
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-6 w-6"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Overlay dietro al drawer mobile */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-6 transition-transform duration-200 ease-out md:static md:z-auto md:w-60 md:translate-x-0 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-emerald-600">📚 BookTrack</p>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Chiudi menu"
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 md:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="cursor-pointer text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
              >
                Esci
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Vuoi uscire?"
        description="Dovrai effettuare di nuovo l'accesso per continuare."
        confirmLabel="Esci"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}

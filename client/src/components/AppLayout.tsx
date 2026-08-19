import { NavLink, Outlet } from 'react-router-dom'
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-slate-800 p-6">
          <div>
            <p className="text-lg font-bold text-emerald-400">BookTrack</p>
            <nav className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div>
            <p className="truncate text-sm text-slate-400">{user?.name}</p>
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-2 text-sm font-medium text-slate-400 hover:text-red-400"
            >
              Esci
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

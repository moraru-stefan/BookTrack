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

  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-6">
          <div>
            <p className="text-lg font-bold text-emerald-600">📚 BookTrack</p>
            <nav className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
                onClick={() => void logout()}
                className="text-xs font-medium text-slate-400 hover:text-red-500"
              >
                Esci
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

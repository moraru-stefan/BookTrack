import { useEffect, useState, type ComponentType } from 'react'
import { BookIcon, BookmarkIcon, CheckCircleIcon, ClockIcon, StarIcon } from '../components/icons'
import { useAuth } from '../contexts/useAuth'
import { getStatistics } from '../lib/library'
import { statusLabels, type Statistics } from '../lib/types'

export function DashboardPage() {
  const { user } = useAuth()
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStatistics()
      .then(setStatistics)
      .catch(() => setError('Impossibile caricare le statistiche'))
  }, [])

  return (
    <div>
      <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Ciao, {user?.name} 👋</h1>
        <p className="mt-1 text-emerald-50">Ecco un riepilogo della tua libreria.</p>
      </div>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      {statistics && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard icon={BookIcon} label="Totale" value={statistics.total} color="slate" />
            <StatCard
              icon={CheckCircleIcon}
              label="Letti"
              value={statistics.read}
              color="emerald"
            />
            <StatCard icon={ClockIcon} label="In lettura" value={statistics.reading} color="sky" />
            <StatCard
              icon={BookmarkIcon}
              label="Da leggere"
              value={statistics.to_read}
              color="amber"
            />
            <StatCard icon={StarIcon} label="Preferiti" value={statistics.favorites} color="rose" />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Voto medio:{' '}
              <span className="font-semibold text-slate-900">
                {statistics.average_rating ?? 'nessun voto'}
              </span>
            </p>
          </div>

          <h2 className="mt-8 text-lg font-semibold text-slate-900">Aggiunti di recente</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {statistics.recent_books.length === 0 && (
              <li className="text-sm text-slate-500">Nessun libro nella libreria ancora.</li>
            )}
            {statistics.recent_books.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {entry.book.cover_url ? (
                    <img
                      src={entry.book.cover_url}
                      alt={entry.book.title}
                      className="h-12 w-9 rounded object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-9 place-items-center rounded bg-slate-100 text-[8px] text-slate-400">
                      N/D
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{entry.book.title}</p>
                    <p className="text-sm text-slate-500">{entry.book.author}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {statusLabels[entry.status]}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

const colorClasses = {
  slate: 'bg-slate-100 text-slate-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  sky: 'bg-sky-100 text-sky-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
} as const

function StatCard({
  icon: IconComponent,
  label,
  value,
  color,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: number
  color: keyof typeof colorClasses
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${colorClasses[color]}`}>
        <IconComponent className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

import { useEffect, useState } from 'react'
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
      <h1 className="text-2xl font-bold text-white">Ciao, {user?.name}</h1>
      <p className="mt-1 text-slate-400">Ecco un riepilogo della tua libreria.</p>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {statistics && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard label="Totale" value={statistics.total} />
            <StatCard label="Letti" value={statistics.read} />
            <StatCard label="In lettura" value={statistics.reading} />
            <StatCard label="Da leggere" value={statistics.to_read} />
            <StatCard label="Preferiti" value={statistics.favorites} />
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Voto medio:{' '}
            <span className="font-semibold text-slate-100">
              {statistics.average_rating ?? 'nessun voto'}
            </span>
          </p>

          <h2 className="mt-8 text-lg font-semibold text-white">Aggiunti di recente</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {statistics.recent_books.length === 0 && (
              <li className="text-sm text-slate-500">Nessun libro nella libreria ancora.</li>
            )}
            {statistics.recent_books.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-100">{entry.book.title}</p>
                  <p className="text-sm text-slate-400">{entry.book.author}</p>
                </div>
                <span className="text-xs font-medium text-emerald-400">
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

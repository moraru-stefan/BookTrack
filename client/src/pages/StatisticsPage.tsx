import { useEffect, useState } from 'react'
import { LoadingBlock } from '../components/Spinner'
import { getStatistics } from '../lib/library'
import { statusLabels, type Statistics } from '../lib/types'

export function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStatistics()
      .then(setStatistics)
      .catch(() => setError('Impossibile caricare le statistiche'))
  }, [])

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  if (!statistics) {
    return <LoadingBlock />
  }

  const breakdown = [
    { label: statusLabels.READ, value: statistics.read, color: 'bg-emerald-500' },
    { label: statusLabels.READING, value: statistics.reading, color: 'bg-sky-500' },
    { label: statusLabels.TO_READ, value: statistics.to_read, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Statistiche</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <BigStat label="Libri totali" value={statistics.total} />
        <BigStat label="Preferiti" value={statistics.favorites} />
        <BigStat label="Voto medio" value={statistics.average_rating ?? '—'} />
        <BigStat label="Letti" value={statistics.read} />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
          Distribuzione per stato
        </h2>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
          {statistics.total > 0 &&
            breakdown.map((item) => (
              <div
                key={item.label}
                className={item.color}
                style={{ width: `${(item.value / statistics.total) * 100}%` }}
              />
            ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
          {breakdown.map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${item.color}`} />
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold tracking-wide text-slate-400 uppercase">
        Aggiunti di recente
      </h2>
      <div className="mt-3 flex flex-col gap-2">
        {statistics.recent_books.length === 0 && (
          <p className="text-sm text-slate-500">Nessun libro nella libreria ancora.</p>
        )}
        {statistics.recent_books.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{entry.book.title}</p>
              <p className="truncate text-sm text-slate-500">{entry.book.author}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              {entry.is_favorite && <span className="text-amber-400">★</span>}
              {entry.rating && <span className="text-slate-500">{entry.rating}/5</span>}
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {statusLabels[entry.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BigStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

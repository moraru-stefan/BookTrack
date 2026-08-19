import { Link } from 'react-router-dom'
import { statusLabels, type LibraryEntry, type ReadingStatus } from '../lib/types'

interface LibraryEntryCardProps {
  entry: LibraryEntry
  onStatusChange: (status: ReadingStatus) => void
  onToggleFavorite: () => void
  onDelete: () => void
}

export function LibraryEntryCard({
  entry,
  onStatusChange,
  onToggleFavorite,
  onDelete,
}: LibraryEntryCardProps) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Link to={`/app/library/${entry.id}`} className="shrink-0">
        {entry.book.cover_url ? (
          <img
            src={entry.book.cover_url}
            alt={entry.book.title}
            className="h-24 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="grid h-24 w-16 place-items-center rounded-lg bg-slate-100 text-xs text-slate-400">
            N/D
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to={`/app/library/${entry.id}`}
            className="font-medium text-slate-900 hover:text-emerald-600"
          >
            {entry.book.title}
          </Link>
          <p className="text-sm text-slate-500">{entry.book.author}</p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <select
            value={entry.status}
            onChange={(event) => onStatusChange(event.target.value as ReadingStatus)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onToggleFavorite}
            className={`text-lg leading-none ${entry.is_favorite ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400'}`}
            aria-label={entry.is_favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            ★
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="ml-auto text-sm text-slate-400 hover:text-red-500"
          >
            Rimuovi
          </button>
        </div>
      </div>
    </div>
  )
}

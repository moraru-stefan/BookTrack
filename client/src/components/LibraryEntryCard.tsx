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
    <div className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <Link to={`/app/library/${entry.id}`} className="shrink-0">
        {entry.book.cover_url ? (
          <img
            src={entry.book.cover_url}
            alt={entry.book.title}
            className="h-24 w-16 rounded object-cover"
          />
        ) : (
          <div className="grid h-24 w-16 place-items-center rounded bg-slate-800 text-xs text-slate-500">
            Nessuna copertina
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to={`/app/library/${entry.id}`}
            className="font-medium text-slate-100 hover:underline"
          >
            {entry.book.title}
          </Link>
          <p className="text-sm text-slate-400">{entry.book.author}</p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <select
            value={entry.status}
            onChange={(event) => onStatusChange(event.target.value as ReadingStatus)}
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
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
            className={`text-lg leading-none ${entry.is_favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
            aria-label={entry.is_favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            ★
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="ml-auto text-sm text-slate-500 hover:text-red-400"
          >
            Rimuovi
          </button>
        </div>
      </div>
    </div>
  )
}

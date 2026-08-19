import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../lib/api'
import {
  deleteLibraryEntry,
  getLibraryEntry,
  setFavorite,
  updateLibraryEntry,
} from '../lib/library'
import { statusLabels, type LibraryEntry, type ReadingStatus } from '../lib/types'

export function LibraryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [entry, setEntry] = useState<LibraryEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [review, setReview] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getLibraryEntry(Number(id))
      .then((loaded) => {
        setEntry(loaded)
        setReview(loaded.review ?? '')
      })
      .catch((caught) =>
        setError(caught instanceof ApiError ? caught.message : 'Libro non trovato'),
      )
      .finally(() => setIsLoading(false))
  }, [id])

  async function handleStatusChange(status: ReadingStatus) {
    if (!entry) return
    const updated = await updateLibraryEntry(entry.id, { status })
    setEntry(updated)
  }

  async function handleRatingChange(rating: number | null) {
    if (!entry) return
    const updated = await updateLibraryEntry(entry.id, { rating })
    setEntry(updated)
  }

  async function handleToggleFavorite() {
    if (!entry) return
    const updated = await setFavorite(entry.id, !entry.is_favorite)
    setEntry(updated)
  }

  async function handleSaveReview() {
    if (!entry) return
    setIsSaving(true)
    try {
      const updated = await updateLibraryEntry(entry.id, { review: review.trim() || null })
      setEntry(updated)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!entry) return
    await deleteLibraryEntry(entry.id)
    navigate('/app/library')
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Caricamento...</p>
  }

  if (error || !entry) {
    return <p className="text-sm text-red-400">{error ?? 'Libro non trovato'}</p>
  }

  return (
    <div className="max-w-2xl">
      <div className="flex gap-6">
        {entry.book.cover_url ? (
          <img
            src={entry.book.cover_url}
            alt={entry.book.title}
            className="h-48 w-32 rounded object-cover"
          />
        ) : (
          <div className="grid h-48 w-32 place-items-center rounded bg-slate-800 text-xs text-slate-500">
            Nessuna copertina
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold text-white">{entry.book.title}</h1>
          <p className="text-slate-400">{entry.book.author}</p>
          {entry.book.category && (
            <p className="mt-1 text-sm text-slate-500">{entry.book.category}</p>
          )}
          {entry.book.published_date && (
            <p className="text-sm text-slate-500">{entry.book.published_date}</p>
          )}

          <button
            type="button"
            onClick={() => void handleToggleFavorite()}
            className={`mt-3 text-2xl leading-none ${entry.is_favorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
            aria-label={entry.is_favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            ★
          </button>
        </div>
      </div>

      {entry.book.description && (
        <p className="mt-6 text-sm leading-6 text-slate-300">{entry.book.description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-6">
        <label className="flex flex-col gap-1 text-sm text-slate-400">
          Stato
          <select
            value={entry.status}
            onChange={(event) => void handleStatusChange(event.target.value as ReadingStatus)}
            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-slate-100"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-sm text-slate-400">
          Voto
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => void handleRatingChange(entry.rating === star ? null : star)}
                className={`text-xl leading-none ${
                  entry.rating && star <= entry.rating
                    ? 'text-amber-400'
                    : 'text-slate-700 hover:text-slate-500'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex flex-col gap-1 text-sm text-slate-400">
          Recensione
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            maxLength={2000}
            rows={5}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
          />
        </label>
        <button
          type="button"
          onClick={() => void handleSaveReview()}
          disabled={isSaving}
          className="mt-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSaving ? 'Salvataggio...' : 'Salva recensione'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => void handleDelete()}
        className="mt-8 text-sm text-slate-500 hover:text-red-400"
      >
        Rimuovi dalla libreria
      </button>
    </div>
  )
}

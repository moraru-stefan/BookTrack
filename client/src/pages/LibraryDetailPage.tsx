import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
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
  const [justSaved, setJustSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!entry) return
    setShowDeleteConfirm(false)
    await deleteLibraryEntry(entry.id)
    navigate('/app/library')
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500">Caricamento...</p>
  }

  if (error || !entry) {
    return <p className="text-sm text-red-500">{error ?? 'Libro non trovato'}</p>
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row">
        {entry.book.cover_url ? (
          <img
            src={entry.book.cover_url}
            alt={entry.book.title}
            className="h-48 w-32 self-center rounded-lg object-cover sm:self-auto"
          />
        ) : (
          <div className="grid h-48 w-32 shrink-0 place-items-center self-center rounded-lg bg-slate-100 text-xs text-slate-400 sm:self-auto">
            Nessuna copertina
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{entry.book.title}</h1>
          <p className="text-slate-500">{entry.book.author}</p>
          {entry.book.category && (
            <p className="mt-1 text-sm text-slate-400">{entry.book.category}</p>
          )}
          {entry.book.published_date && (
            <p className="text-sm text-slate-400">{entry.book.published_date}</p>
          )}

          <button
            type="button"
            onClick={() => void handleToggleFavorite()}
            className={`mt-3 cursor-pointer text-2xl leading-none transition-transform active:scale-90 ${entry.is_favorite ? 'text-amber-400' : 'text-slate-300 hover:text-slate-400'}`}
            aria-label={entry.is_favorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            ★
          </button>
        </div>
      </div>

      {entry.book.description && (
        <p className="mt-6 text-sm leading-6 text-slate-600">{entry.book.description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1 text-sm text-slate-500">
          Stato
          <select
            value={entry.status}
            onChange={(event) => void handleStatusChange(event.target.value as ReadingStatus)}
            className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-900 transition-colors hover:bg-slate-100"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-sm text-slate-500">
          Voto
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => void handleRatingChange(entry.rating === star ? null : star)}
                className={`cursor-pointer text-xl leading-none transition-transform active:scale-90 ${
                  entry.rating && star <= entry.rating
                    ? 'text-amber-400'
                    : 'text-slate-200 hover:text-slate-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1 text-sm text-slate-500">
          Recensione
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            maxLength={2000}
            rows={5}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <button
          type="button"
          onClick={() => void handleSaveReview()}
          disabled={isSaving}
          className={`mt-2 w-full cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors active:scale-95 disabled:cursor-default disabled:opacity-60 sm:w-auto ${
            justSaved ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isSaving ? 'Salvataggio...' : justSaved ? 'Salvato ✓' : 'Salva recensione'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowDeleteConfirm(true)}
        className="mt-6 cursor-pointer text-sm text-slate-400 transition-colors hover:text-red-500"
      >
        Rimuovi dalla libreria
      </button>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Rimuovere questo libro?"
        description={`"${entry.book.title}" verrà rimosso dalla tua libreria.`}
        confirmLabel="Rimuovi"
        danger
        onConfirm={() => void handleDelete()}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

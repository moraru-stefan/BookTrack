import { useEffect, useState, type FormEvent } from 'react'
import { LibraryEntryCard } from '../components/LibraryEntryCard'
import { ApiError } from '../lib/api'
import {
  addToLibrary,
  deleteLibraryEntry,
  listLibrary,
  searchBooks,
  setFavorite,
  updateLibraryEntry,
} from '../lib/library'
import type { BookSearchResult, LibraryEntry, ReadingStatus } from '../lib/types'

export function LibraryPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(true)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BookSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [addingExternalId, setAddingExternalId] = useState<string | null>(null)

  useEffect(() => {
    listLibrary()
      .then(setEntries)
      .finally(() => setIsLoadingLibrary(false))
  }, [])

  async function handleSearch(event: FormEvent) {
    event.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const found = await searchBooks(query)
      setResults(found)
    } catch (error) {
      setSearchError(error instanceof ApiError ? error.message : 'Ricerca non riuscita')
    } finally {
      setIsSearching(false)
    }
  }

  async function handleAdd(book: BookSearchResult) {
    setAddingExternalId(book.external_id)
    try {
      const entry = await addToLibrary(book)
      setEntries((current) => [entry, ...current])
    } catch (error) {
      setSearchError(error instanceof ApiError ? error.message : 'Impossibile aggiungere il libro')
    } finally {
      setAddingExternalId(null)
    }
  }

  async function handleStatusChange(entryId: number, status: ReadingStatus) {
    const updated = await updateLibraryEntry(entryId, { status })
    setEntries((current) => current.map((entry) => (entry.id === entryId ? updated : entry)))
  }

  async function handleToggleFavorite(entry: LibraryEntry) {
    const updated = await setFavorite(entry.id, !entry.is_favorite)
    setEntries((current) => current.map((item) => (item.id === entry.id ? updated : item)))
  }

  async function handleDelete(entryId: number) {
    await deleteLibraryEntry(entryId)
    setEntries((current) => current.filter((entry) => entry.id !== entryId))
  }

  const libraryExternalIds = new Set(entries.map((entry) => entry.book.external_id))

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Libreria</h1>

      <form onSubmit={(event) => void handleSearch(event)} className="mt-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cerca un libro per titolo..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSearching ? 'Cerco...' : 'Cerca'}
        </button>
      </form>

      {searchError && <p className="mt-2 text-sm text-red-400">{searchError}</p>}

      {results.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Risultati ricerca</h2>
          {results.map((book) => {
            const alreadyAdded = libraryExternalIds.has(book.external_id)
            return (
              <div
                key={book.external_id}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-100">{book.title}</p>
                  <p className="text-sm text-slate-400">{book.author}</p>
                </div>
                <button
                  type="button"
                  disabled={alreadyAdded || addingExternalId === book.external_id}
                  onClick={() => void handleAdd(book)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-100 hover:bg-slate-800 disabled:opacity-50"
                >
                  {alreadyAdded
                    ? 'Già in libreria'
                    : addingExternalId === book.external_id
                      ? 'Aggiungo...'
                      : 'Aggiungi'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold text-slate-400 uppercase">La tua libreria</h2>

      {isLoadingLibrary && <p className="mt-4 text-sm text-slate-500">Caricamento...</p>}

      {!isLoadingLibrary && entries.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          Nessun libro ancora. Cerca un titolo qui sopra per iniziare.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {entries.map((entry) => (
          <LibraryEntryCard
            key={entry.id}
            entry={entry}
            onStatusChange={(status) => void handleStatusChange(entry.id, status)}
            onToggleFavorite={() => void handleToggleFavorite(entry)}
            onDelete={() => void handleDelete(entry.id)}
          />
        ))}
      </div>
    </div>
  )
}

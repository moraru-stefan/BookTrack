import { useEffect, useState } from 'react'
import { LibraryEntryCard } from '../components/LibraryEntryCard'
import { deleteLibraryEntry, listFavorites, setFavorite, updateLibraryEntry } from '../lib/library'
import type { LibraryEntry, ReadingStatus } from '../lib/types'

export function FavoritesPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    listFavorites()
      .then(setEntries)
      .finally(() => setIsLoading(false))
  }, [])

  async function handleStatusChange(entryId: number, status: ReadingStatus) {
    const updated = await updateLibraryEntry(entryId, { status })
    setEntries((current) => current.map((entry) => (entry.id === entryId ? updated : entry)))
  }

  async function handleToggleFavorite(entry: LibraryEntry) {
    await setFavorite(entry.id, false)
    setEntries((current) => current.filter((item) => item.id !== entry.id))
  }

  async function handleDelete(entryId: number) {
    await deleteLibraryEntry(entryId)
    setEntries((current) => current.filter((entry) => entry.id !== entryId))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Preferiti</h1>

      {isLoading && <p className="mt-4 text-sm text-slate-500">Caricamento...</p>}

      {!isLoading && entries.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">Nessun libro preferito ancora.</p>
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

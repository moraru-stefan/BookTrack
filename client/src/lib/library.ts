import { api } from './api'
import type { BookSearchResult, LibraryEntry, ReadingStatus, Statistics } from './types'

export function getStatistics() {
  return api.get<Statistics>('/statistics')
}

export function searchBooks(query: string) {
  return api.get<BookSearchResult[]>(`/books/search?q=${encodeURIComponent(query)}`)
}

export function listLibrary() {
  return api.get<LibraryEntry[]>('/library')
}

export function listFavorites() {
  return api.get<LibraryEntry[]>('/favorites')
}

export function getLibraryEntry(id: number) {
  return api.get<LibraryEntry>(`/library/${id}`)
}

export function addToLibrary(book: BookSearchResult, status: ReadingStatus = 'TO_READ') {
  return api.post<LibraryEntry>('/library', { book, status })
}

export interface LibraryEntryUpdate {
  status?: ReadingStatus
  rating?: number | null
  review?: string | null
  is_favorite?: boolean
}

export function updateLibraryEntry(id: number, updates: LibraryEntryUpdate) {
  return api.patch<LibraryEntry>(`/library/${id}`, updates)
}

export function setFavorite(id: number, isFavorite: boolean) {
  return api.patch<LibraryEntry>(`/library/${id}/favorite`, { is_favorite: isFavorite })
}

export function deleteLibraryEntry(id: number) {
  return api.delete<void>(`/library/${id}`)
}

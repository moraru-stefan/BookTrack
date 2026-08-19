export type ReadingStatus = 'TO_READ' | 'READING' | 'READ'

export interface Book {
  id: number
  external_id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
  isbn: string | null
  published_date: string | null
  category: string | null
}

export interface BookSearchResult {
  external_id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
  isbn: string | null
  published_date: string | null
  category: string | null
}

export interface LibraryEntry {
  id: number
  status: ReadingStatus
  rating: number | null
  review: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
  book: Book
}

export const statusLabels: Record<ReadingStatus, string> = {
  TO_READ: 'Da leggere',
  READING: 'In lettura',
  READ: 'Letto',
}

export interface Statistics {
  total: number
  read: number
  reading: number
  to_read: number
  favorites: number
  average_rating: number | null
  recent_books: LibraryEntry[]
}

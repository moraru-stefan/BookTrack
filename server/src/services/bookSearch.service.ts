import { ApiError } from '../lib/ApiError.js'

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

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
}

const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json'

export async function searchExternalBooks(query: string): Promise<BookSearchResult[]> {
  const url = new URL(OPEN_LIBRARY_SEARCH_URL)
  url.searchParams.set('q', query)
  url.searchParams.set('limit', '20')
  url.searchParams.set('fields', 'key,title,author_name,first_publish_year,isbn,cover_i')

  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new ApiError(502, 'Book search is currently unavailable')
  }

  if (!response.ok) {
    throw new ApiError(502, 'Book search is currently unavailable')
  }

  const data = (await response.json()) as OpenLibraryResponse

  return data.docs.map((doc) => ({
    external_id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    description: null,
    cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    isbn: doc.isbn?.[0] ?? null,
    published_date: doc.first_publish_year ? String(doc.first_publish_year) : null,
    category: null,
  }))
}

import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db.js'
import { ApiError } from '../lib/ApiError.js'
import type { Book } from './books.service.js'

export type ReadingStatus = 'TO_READ' | 'READING' | 'READ'

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

interface LibraryEntryRow extends RowDataPacket {
  id: number
  status: ReadingStatus
  rating: number | null
  review: string | null
  is_favorite: number
  created_at: string
  updated_at: string
  book_id: number
  external_id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
  isbn: string | null
  published_date: string | null
  category: string | null
  book_created_at: string
  book_updated_at: string
}

const SELECT_LIBRARY_ENTRY = `
  SELECT
    ub.id, ub.status, ub.rating, ub.review, ub.is_favorite, ub.created_at, ub.updated_at,
    b.id AS book_id, b.external_id, b.title, b.author, b.description, b.cover_url,
    b.isbn, b.published_date, b.category, b.created_at AS book_created_at, b.updated_at AS book_updated_at
  FROM user_books ub
  JOIN books b ON b.id = ub.book_id
`

function mapRow(row: LibraryEntryRow): LibraryEntry {
  return {
    id: row.id,
    status: row.status,
    rating: row.rating,
    review: row.review,
    is_favorite: Boolean(row.is_favorite),
    created_at: row.created_at,
    updated_at: row.updated_at,
    book: {
      id: row.book_id,
      external_id: row.external_id,
      title: row.title,
      author: row.author,
      description: row.description,
      cover_url: row.cover_url,
      isbn: row.isbn,
      published_date: row.published_date,
      category: row.category,
      created_at: row.book_created_at,
      updated_at: row.book_updated_at,
    },
  }
}

export async function listLibrary(userId: number): Promise<LibraryEntry[]> {
  const [rows] = await pool.query<LibraryEntryRow[]>(
    `${SELECT_LIBRARY_ENTRY} WHERE ub.user_id = ? ORDER BY ub.created_at DESC`,
    [userId],
  )
  return rows.map(mapRow)
}

export async function listFavorites(userId: number): Promise<LibraryEntry[]> {
  const [rows] = await pool.query<LibraryEntryRow[]>(
    `${SELECT_LIBRARY_ENTRY} WHERE ub.user_id = ? AND ub.is_favorite = 1 ORDER BY ub.created_at DESC`,
    [userId],
  )
  return rows.map(mapRow)
}

export async function getLibraryEntry(userId: number, entryId: number): Promise<LibraryEntry | null> {
  const [rows] = await pool.query<LibraryEntryRow[]>(
    `${SELECT_LIBRARY_ENTRY} WHERE ub.id = ? AND ub.user_id = ?`,
    [entryId, userId],
  )
  return rows[0] ? mapRow(rows[0]) : null
}

export interface NewLibraryEntry {
  status: ReadingStatus
  rating: number | null
  review: string | null
  is_favorite: boolean
}

export async function addToLibrary(
  userId: number,
  bookId: number,
  entry: NewLibraryEntry,
): Promise<LibraryEntry> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO user_books (user_id, book_id, status, rating, review, is_favorite)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, bookId, entry.status, entry.rating, entry.review, entry.is_favorite],
    )

    const created = await getLibraryEntry(userId, result.insertId)
    if (!created) {
      throw new Error('Failed to load library entry after insert')
    }
    return created
  } catch (error) {
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      throw new ApiError(409, 'This book is already in your library')
    }
    throw error
  }
}

export interface LibraryEntryUpdate {
  status?: ReadingStatus
  rating?: number | null
  review?: string | null
  is_favorite?: boolean
}

export async function updateLibraryEntry(
  userId: number,
  entryId: number,
  updates: LibraryEntryUpdate,
): Promise<LibraryEntry | null> {
  const fields: string[] = []
  const values: unknown[] = []

  if (updates.status !== undefined) {
    fields.push('status = ?')
    values.push(updates.status)
  }
  if (updates.rating !== undefined) {
    fields.push('rating = ?')
    values.push(updates.rating)
  }
  if (updates.review !== undefined) {
    fields.push('review = ?')
    values.push(updates.review)
  }
  if (updates.is_favorite !== undefined) {
    fields.push('is_favorite = ?')
    values.push(updates.is_favorite)
  }

  if (fields.length === 0) {
    return getLibraryEntry(userId, entryId)
  }

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE user_books SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    [...values, entryId, userId],
  )

  if (result.affectedRows === 0) {
    return null
  }

  return getLibraryEntry(userId, entryId)
}

export async function deleteLibraryEntry(userId: number, entryId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM user_books WHERE id = ? AND user_id = ?', [
    entryId,
    userId,
  ])
  return result.affectedRows > 0
}

export async function setFavorite(
  userId: number,
  entryId: number,
  isFavorite: boolean,
): Promise<LibraryEntry | null> {
  return updateLibraryEntry(userId, entryId, { is_favorite: isFavorite })
}

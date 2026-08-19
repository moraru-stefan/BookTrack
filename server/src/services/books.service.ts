import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db.js'

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
  created_at: string
  updated_at: string
}

type BookRow = Book & RowDataPacket

export async function listBooks(): Promise<Book[]> {
  const [rows] = await pool.query<BookRow[]>('SELECT * FROM books ORDER BY title')
  return rows
}

export async function getBookById(id: number): Promise<Book | null> {
  const [rows] = await pool.query<BookRow[]>('SELECT * FROM books WHERE id = ?', [id])
  return rows[0] ?? null
}

export interface BookInput {
  external_id: string
  title: string
  author?: string | null
  description?: string | null
  cover_url?: string | null
  isbn?: string | null
  published_date?: string | null
  category?: string | null
}

export async function findOrCreateBook(input: BookInput): Promise<Book> {
  const [existingRows] = await pool.query<BookRow[]>('SELECT * FROM books WHERE external_id = ?', [
    input.external_id,
  ])

  const existing = existingRows[0]
  if (existing) {
    return existing
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO books (external_id, title, author, description, cover_url, isbn, published_date, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.external_id,
      input.title,
      input.author ?? null,
      input.description ?? null,
      input.cover_url ?? null,
      input.isbn ?? null,
      input.published_date ?? null,
      input.category ?? null,
    ],
  )

  const created = await getBookById(result.insertId)
  if (!created) {
    throw new Error('Failed to load book after insert')
  }
  return created
}

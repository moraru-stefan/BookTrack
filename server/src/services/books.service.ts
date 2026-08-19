import type { RowDataPacket } from 'mysql2'
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

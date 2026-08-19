import type { RowDataPacket } from 'mysql2'
import { pool } from '../db.js'
import { getRecentLibraryEntries, type LibraryEntry } from './library.service.js'

export interface Statistics {
  total: number
  read: number
  reading: number
  to_read: number
  favorites: number
  average_rating: number | null
  recent_books: LibraryEntry[]
}

interface StatsRow extends RowDataPacket {
  total: number
  read_count: number
  reading_count: number
  to_read_count: number
  favorites_count: number
  average_rating: number | null
}

const RECENT_BOOKS_LIMIT = 5

export async function getStatistics(userId: number): Promise<Statistics> {
  const [rows] = await pool.query<StatsRow[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'READ') AS read_count,
       SUM(status = 'READING') AS reading_count,
       SUM(status = 'TO_READ') AS to_read_count,
       SUM(is_favorite = 1) AS favorites_count,
       AVG(rating) AS average_rating
     FROM user_books
     WHERE user_id = ?`,
    [userId],
  )

  const row = rows[0]
  const recentBooks = await getRecentLibraryEntries(userId, RECENT_BOOKS_LIMIT)

  return {
    total: Number(row?.total ?? 0),
    read: Number(row?.read_count ?? 0),
    reading: Number(row?.reading_count ?? 0),
    to_read: Number(row?.to_read_count ?? 0),
    favorites: Number(row?.favorites_count ?? 0),
    average_rating:
      row?.average_rating != null ? Math.round(Number(row.average_rating) * 10) / 10 : null,
    recent_books: recentBooks,
  }
}

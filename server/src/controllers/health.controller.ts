import type { RequestHandler } from 'express'
import { pool } from '../db.js'

export const health: RequestHandler = (_request, response) => {
  response.status(200).json({ success: true, message: 'BookTrack API is running' })
}

export const dbCheck: RequestHandler = async (_request, response) => {
  await pool.query('SELECT 1')
  response.status(200).json({ success: true, message: 'Database connection is working' })
}

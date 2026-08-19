import bcrypt from 'bcryptjs'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db.js'

export interface PublicUser {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

interface UserRow extends RowDataPacket {
  id: number
  name: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
}

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function findUserByEmail(email: string): Promise<PublicUser | null> {
  const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email])
  const row = rows[0]
  return row ? toPublicUser(row) : null
}

export async function findUserById(id: number): Promise<PublicUser | null> {
  const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id])
  const row = rows[0]
  return row ? toPublicUser(row) : null
}

export async function createUser(name: string, email: string, password: string): Promise<PublicUser> {
  const passwordHash = await bcrypt.hash(password, 10)

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash],
  )

  const created = await findUserById(result.insertId)

  if (!created) {
    throw new Error('Failed to load user after insert')
  }

  return created
}

export async function verifyPassword(email: string, password: string): Promise<PublicUser | null> {
  const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email])
  const row = rows[0]

  if (!row) {
    return null
  }

  const isValid = await bcrypt.compare(password, row.password_hash)
  return isValid ? toPublicUser(row) : null
}

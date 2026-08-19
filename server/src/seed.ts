import 'dotenv/config'
import bcrypt from 'bcryptjs'
import type { ResultSetHeader } from 'mysql2'
import { pool } from './db.js'

async function insertUser(name: string, email: string, passwordHash: string) {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash],
  )
  return result.insertId
}

async function insertBook(book: {
  externalId: string
  title: string
  author: string
  description: string
  coverUrl: string
  isbn: string
  publishedDate: string
  category: string
}) {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO books (external_id, title, author, description, cover_url, isbn, published_date, category)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      book.externalId,
      book.title,
      book.author,
      book.description,
      book.coverUrl,
      book.isbn,
      book.publishedDate,
      book.category,
    ],
  )
  return result.insertId
}

async function insertUserBook(entry: {
  userId: number
  bookId: number
  status: 'TO_READ' | 'READING' | 'READ'
  rating: number | null
  review: string | null
  isFavorite: boolean
}) {
  await pool.query(
    `INSERT INTO user_books (user_id, book_id, status, rating, review, is_favorite)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [entry.userId, entry.bookId, entry.status, entry.rating, entry.review, entry.isFavorite],
  )
}

async function run() {
  await pool.query('DELETE FROM user_books')
  await pool.query('DELETE FROM books')
  await pool.query('DELETE FROM users')

  const passwordHash = await bcrypt.hash('Password123!', 10)

  const alexId = await insertUser('Alex Rossi', 'alex@example.com', passwordHash)
  const giuliaId = await insertUser('Giulia Bianchi', 'giulia@example.com', passwordHash)

  const duneId = await insertBook({
    externalId: 'seed-001',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A noble family becomes embroiled in a war for control of the desert planet Arrakis.',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg',
    isbn: '9780441013593',
    publishedDate: '1965',
    category: 'Science Fiction',
  })

  const midnightLibraryId = await insertBook({
    externalId: 'seed-002',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library with infinite books of alternate lives.',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
    isbn: '9780525559474',
    publishedDate: '2020',
    category: 'Fiction',
  })

  const hailMaryId = await insertBook({
    externalId: 'seed-003',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'A lone astronaut must save humanity from extinction in this science fiction thriller.',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
    isbn: '9780593135204',
    publishedDate: '2021',
    category: 'Science Fiction',
  })

  const atomicHabitsId = await insertBook({
    externalId: 'seed-004',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A guide to building good habits and breaking bad ones through small daily changes.',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    isbn: '9780735211292',
    publishedDate: '2018',
    category: 'Non-Fiction',
  })

  const prideAndPrejudiceId = await insertBook({
    externalId: 'seed-005',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A witty exploration of manners, marriage, and social standing in 19th-century England.',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    isbn: '9780141439518',
    publishedDate: '1813',
    category: 'Classic',
  })

  await insertUserBook({
    userId: alexId,
    bookId: duneId,
    status: 'READING',
    rating: null,
    review: null,
    isFavorite: true,
  })

  await insertUserBook({
    userId: alexId,
    bookId: midnightLibraryId,
    status: 'TO_READ',
    rating: null,
    review: null,
    isFavorite: false,
  })

  await insertUserBook({
    userId: alexId,
    bookId: atomicHabitsId,
    status: 'READ',
    rating: 5,
    review: 'Practical and easy to apply. Changed how I think about small habits.',
    isFavorite: false,
  })

  await insertUserBook({
    userId: giuliaId,
    bookId: hailMaryId,
    status: 'READ',
    rating: 4,
    review: 'Fun and clever, a bit slow in the middle.',
    isFavorite: true,
  })

  await insertUserBook({
    userId: giuliaId,
    bookId: prideAndPrejudiceId,
    status: 'TO_READ',
    rating: null,
    review: null,
    isFavorite: false,
  })

  await insertUserBook({
    userId: giuliaId,
    bookId: duneId,
    status: 'READING',
    rating: null,
    review: null,
    isFavorite: false,
  })

  console.log('Seed complete: 2 users, 5 books, 6 library entries.')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => pool.end())

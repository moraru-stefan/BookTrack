# 📚 BookTrack

A full-stack web app for tracking your personal reading library — search books, mark reading status, rate and review, and view personalized statistics.

## Features

- 🔐 Register, login, and a personal profile (secure login with JWT)
- 🔍 Book search powered by the Open Library API
- 📖 Personal library: add, edit, remove books, mark them as `To Read` / `Reading` / `Read`, rate and review them, mark favorites
- 📊 Dashboard with reading stats (total books, average rating, recently added, and more)
- 📱 Mobile-friendly design with a slide-out menu on small screens

## Tech stack

| Layer | Technologies |
|---|---|
| Client | React, Vite, TypeScript, React Router, Tailwind CSS |
| Server | Node.js, Express, TypeScript |
| Database | MySQL (writing SQL by hand instead of using a library, to practice SQL) |
| Auth | Secure login with hashed passwords and JWT |
| Validation | Zod, on the server side |

## How it works

The React frontend never talks to the database directly. Every request goes through the Express backend first, which checks permissions and validates the data before reading or writing to MySQL, or calling the Open Library API for book search.

## Getting started

Server: `cd server`, `npm install`, `cp .env.example .env` (add your DB credentials and a `JWT_SECRET`), `npm run migrate`, `npm run seed`, `npm run dev`.

Client (new terminal): `cd client`, `npm install`, `npm run dev`.

## Project status

The main features (login, search, library management, and statistics) are built and tested. It's not online yet — this was a personal project to practice full-stack development, so for now it only runs on your own computer.

## License

MIT

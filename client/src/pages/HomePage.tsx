import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40 sm:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-400 uppercase">
          BookTrack
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Tieni traccia dei tuoi libri.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          Cerca libri, gestisci la tua libreria personale, segna lo stato di lettura e le tue
          statistiche.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/login"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Accedi
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800"
          >
            Registrati
          </Link>
        </div>
      </section>
    </main>
  )
}

import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase">
          📚 BookTrack
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Tieni traccia dei tuoi libri.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-500">
          Cerca libri, gestisci la tua libreria personale, segna lo stato di lettura e le tue
          statistiche.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/login"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 active:scale-95"
          >
            Accedi
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-95"
          >
            Registrati
          </Link>
        </div>
      </section>
    </main>
  )
}

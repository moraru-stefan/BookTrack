import { Link } from 'react-router-dom'
import { BookIcon, ClockIcon, StarIcon } from '../components/icons'

const features = [
  {
    icon: BookIcon,
    title: 'Cerca e aggiungi libri',
    description: 'Trova qualsiasi titolo e aggiungilo alla tua libreria personale in un click.',
  },
  {
    icon: ClockIcon,
    title: 'Segna lo stato di lettura',
    description: 'Da leggere, in lettura o letto: tieni traccia di dove sei arrivato.',
  },
  {
    icon: StarIcon,
    title: 'Voti, recensioni e statistiche',
    description:
      'Valuta i tuoi libri, scrivi una recensione e guarda le tue statistiche di lettura.',
  },
]

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-lg font-bold text-emerald-600">📚 BookTrack</p>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 transition-colors hover:text-emerald-600"
            >
              Accedi
            </Link>
            <Link
              to="/register"
              className="cursor-pointer rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors active:scale-95 hover:bg-emerald-600"
            >
              Registrati
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase">
          La tua libreria personale
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Tieni traccia dei tuoi libri.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
          Cerca libri, gestisci la tua libreria personale, segna lo stato di lettura e scopri le tue
          statistiche di lettura.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="cursor-pointer rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors active:scale-95 hover:bg-emerald-600"
          >
            Inizia ora
          </Link>
          <Link
            to="/login"
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors active:scale-95 hover:bg-slate-50"
          >
            Accedi
          </Link>
        </div>

        <div className="mt-24 grid w-full gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

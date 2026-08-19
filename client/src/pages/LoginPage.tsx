import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../contexts/useAuth'
import { ApiError } from '../lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/app')
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Qualcosa è andato storto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase">
          📚 BookTrack
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Accedi</h1>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-slate-600">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors active:scale-95 hover:bg-emerald-600 disabled:cursor-default disabled:opacity-60"
          >
            {isSubmitting && <Spinner className="h-4 w-4" />}
            {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Non hai un account?{' '}
          <Link
            to="/register"
            className="font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
          >
            Registrati
          </Link>
        </p>
      </section>
    </main>
  )
}

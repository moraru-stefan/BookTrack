import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase">
          📚 BookTrack
        </p>
        <div className="mt-2">
          <LoginForm
            onSuccess={() => navigate('/app')}
            switchElement={
              <Link
                to="/register"
                className="font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
              >
                Registrati
              </Link>
            }
          />
        </div>
      </section>
    </main>
  )
}

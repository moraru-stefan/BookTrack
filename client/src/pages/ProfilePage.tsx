import { useAuth } from '../contexts/useAuth'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Profilo</h1>
      <div className="mt-4 max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="text-slate-400">Nome</dt>
            <dd className="text-slate-900">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="text-slate-900">{user?.email}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

import { useAuth } from '../contexts/useAuth'

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Profilo</h1>
      <div className="mt-4 text-slate-300">
        <p>Nome: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>
    </div>
  )
}

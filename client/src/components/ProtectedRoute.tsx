import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Spinner } from './Spinner'
import { useAuth } from '../contexts/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

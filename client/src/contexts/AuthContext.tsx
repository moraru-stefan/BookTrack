import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { AuthContext, type User } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get<User>('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const loggedInUser = await api.post<User>('/auth/login', { email, password })
    setUser(loggedInUser)
  }

  async function register(name: string, email: string, password: string) {
    const newUser = await api.post<User>('/auth/register', { name, email, password })
    setUser(newUser)
  }

  async function logout() {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

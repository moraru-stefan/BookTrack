import { createContext } from 'react'

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

"use client"

import { useSession } from "next-auth/react"
import { createContext, useContext, type ReactNode } from "react"

type AuthContextType = {
  isAdmin: boolean
  isAuthenticated: boolean
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  } | null
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isAuthenticated: false,
  user: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const isAuthenticated = status === "authenticated"
  const isAdmin = session?.user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAuthenticated,
        user: session?.user || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


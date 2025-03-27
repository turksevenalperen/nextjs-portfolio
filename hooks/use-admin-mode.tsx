"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

type AdminModeContextType = {
  isAdminMode: boolean
  toggleAdminMode: () => void
  adminDialogOpen: boolean
  setAdminDialogOpen: (open: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextType>({
  isAdminMode: false,
  toggleAdminMode: () => {},
  adminDialogOpen: false,
  setAdminDialogOpen: () => {},
})

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()
  const [isAdminMode, setIsAdminMode] = useState(isAdmin)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)

  // Admin değilse admin modunu açamaz
  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode((prev) => !prev)
    }
  }

  return (
    <AdminModeContext.Provider
      value={{
        isAdminMode: isAdmin && isAdminMode, // Sadece admin ise ve admin modu açıksa true
        toggleAdminMode,
        adminDialogOpen,
        setAdminDialogOpen,
      }}
    >
      {children}
    </AdminModeContext.Provider>
  )
}

export const useAdminMode = () => useContext(AdminModeContext)


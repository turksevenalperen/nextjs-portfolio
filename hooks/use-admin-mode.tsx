"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminModeContextType {
  isAdminMode: boolean
  setAdminMode: (value: boolean) => void
  adminDialogOpen: boolean
  setAdminDialogOpen: (value: boolean) => void
  handleAdminSubmit: (e: React.FormEvent) => void
  toggleAdminMode: () => void // New function to toggle admin mode
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined)

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setAdminMode] = useState(false)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminError, setAdminError] = useState("")

  // Sayfa yenilendiğinde admin modunu localStorage'dan geri yükle
  useEffect(() => {
    const savedAdminMode = localStorage.getItem("adminMode")
    if (savedAdminMode === "true") {
      setAdminMode(true)
    }
  }, [])

  // Admin modu değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("adminMode", isAdminMode.toString())
  }, [isAdminMode])

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Admin şifresi kontrolü (fake)
    if (adminPassword === "admin123") {
      // Şifre doğru
      setAdminMode(true)
      setAdminDialogOpen(false)
      setAdminError("")
      setAdminPassword("")
    } else {
      // Şifre yanlış
      setAdminError("Yanlış şifre. Lütfen tekrar deneyin.")
    }
  }

  // Yeni fonksiyon: Admin modunu aç/kapat
  const toggleAdminMode = () => {
    if (isAdminMode) {
      // Eğer admin modu açıksa, kapat
      setAdminMode(false)
    } else {
      // Eğer admin modu kapalıysa, dialog'u aç
      setAdminDialogOpen(true)
    }
  }

  return (
    <AdminModeContext.Provider
      value={{
        isAdminMode,
        setAdminMode,
        adminDialogOpen,
        setAdminDialogOpen,
        handleAdminSubmit,
        toggleAdminMode, // Yeni fonksiyonu context'e ekle
      }}
    >
      {children}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Modu</DialogTitle>
            <DialogDescription>Admin moduna geçmek için şifreyi girin</DialogDescription>
          </DialogHeader>

          {adminError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{adminError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Admin Şifresi</Label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">(Fake: Şifre "admin123")</p>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="button" variant="outline" onClick={() => setAdminDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Giriş Yap</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminModeContext.Provider>
  )
}

export function useAdminMode() {
  const context = useContext(AdminModeContext)
  if (context === undefined) {
    throw new Error("useAdminMode must be used within an AdminModeProvider")
  }
  return context
}

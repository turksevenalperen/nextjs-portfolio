"use client"

import { io, type Socket } from "socket.io-client"
import { useEffect, useState } from "react"
import type { AktifUygulama } from "./types"

// Socket.IO istemcisi için singleton
let socket: Socket | null = null

// Socket.IO bağlantısını başlat
export const initSocket = async () => {
  // Socket zaten başlatılmışsa, yeni bir tane oluşturma
  if (socket) return socket

  // Önce Socket.IO sunucusunu başlat
  await fetch("/api/socket")

  // Socket.IO istemcisini oluştur
  socket = io()

  // Bağlantı olaylarını dinle
  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected")
  })

  return socket
}

// WebSocket üzerinden aktif uygulamaları dinleyen React hook'u
export const useAktifUygulamalar = (initialData: AktifUygulama[] = []) => {
  const [aktifUygulamalar, setAktifUygulamalar] = useState<AktifUygulama[]>(initialData)

  useEffect(() => {
    // Socket.IO bağlantısını başlat
    const setupSocket = async () => {
      const socket = await initSocket()

      // Aktif uygulamalar güncellendiğinde
      socket.on("aktifUygulamalar", (data: AktifUygulama[]) => {
        setAktifUygulamalar(data)
      })

      // Component unmount olduğunda
      return () => {
        socket.off("aktifUygulamalar")
      }
    }

    setupSocket()
  }, [])

  return aktifUygulamalar
}

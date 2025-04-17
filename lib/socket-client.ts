"use client"

import { useEffect, useState } from "react"
import io from "socket.io-client"
import type { AktifUygulama, AktiflikDurumu, EtkinlikSuresi } from "./types"

// WebSocket üzerinden verileri dinleyen React hook'u
export function useAktifUygulamalar(
  initialAktifUygulamalar: AktifUygulama[] = [],
  initialAktiflikDurumu: AktiflikDurumu[] = [],
  initialEtkinlikSuresi: EtkinlikSuresi[] = [],
) {
  const [aktifUygulamalar, setAktifUygulamalar] = useState<AktifUygulama[]>(initialAktifUygulamalar)
  const [aktiflikDurumu, setAktiflikDurumu] = useState<AktiflikDurumu[]>(initialAktiflikDurumu)
  const [etkinlikSuresi, setEtkinlikSuresi] = useState<EtkinlikSuresi[]>(initialEtkinlikSuresi)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Socket.IO bağlantısını başlat
    const socketInitializer = async () => {
      try {
        // Önce Socket.IO sunucusunu başlat
        await fetch("/api/socket")

        // Socket.IO istemcisini oluştur
        const socket = io()

        // Bağlantı olaylarını dinle
        socket.on("connect", () => {
          console.log("Socket connected!", socket.id)
          setIsConnected(true)

          // Bağlantı kurulduğunda veri iste
          socket.emit("getAktifUygulamalar")
          socket.emit("getAktiflikDurumu")
          socket.emit("getEtkinlikSuresi")
        })

        // Aktif uygulamalar güncellendiğinde
        socket.on("aktifUygulamalar", (newData: AktifUygulama[]) => {
          console.log("New aktifUygulamalar received:", new Date().toISOString(), newData.length)
          setAktifUygulamalar(newData)
        })

        // Aktiflik durumları güncellendiğinde
        socket.on("aktiflikDurumu", (newData: AktiflikDurumu[]) => {
          console.log("New aktiflikDurumu received:", new Date().toISOString(), newData.length)
          setAktiflikDurumu(newData)
        })

        // Etkinlik süreleri güncellendiğinde
        socket.on("etkinlikSuresi", (newData: EtkinlikSuresi[]) => {
          console.log("New etkinlikSuresi received:", new Date().toISOString(), newData.length)
          setEtkinlikSuresi(newData)
        })

        // Bağlantı kesildiğinde
        socket.on("disconnect", () => {
          console.log("Socket disconnected")
          setIsConnected(false)
        })

        // Component unmount olduğunda
        return () => {
          socket.disconnect()
        }
      } catch (error) {
        console.error("Socket initialization error:", error)
      }
    }

    socketInitializer()
  }, [])

  // Durum güncelleme fonksiyonu
  const updateDurum = async (id: number, durum: string) => {
    try {
      const response = await fetch("/api/aktiflik-durumu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, durum }),
      })

      if (!response.ok) {
        throw new Error("Durum güncellenemedi")
      }

      return true
    } catch (error) {
      console.error("Durum güncelleme hatası:", error)
      return false
    }
  }

  return {
    aktifUygulamalar,
    aktiflikDurumu,
    etkinlikSuresi,
    isConnected,
    updateDurum,
  }
}

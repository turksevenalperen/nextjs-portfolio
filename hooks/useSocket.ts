"use client"

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

let socket: Socket

export const useSocket = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const init = async () => {
      await fetch("/api/socket") // Socket sunucusunu başlat
      socket = io()

      socket.on("connect", () => {
        console.log("İstemci bağlandı:", socket.id)
        setConnected(true)

        // İstemciden sunucuya mesaj gönder
        socket.emit("hello", "Merhaba Sunucu!")
      })

      socket.on("welcome", (msg) => {
        console.log("Sunucudan gelen mesaj:", msg)
      })

      socket.on("disconnect", () => {
        setConnected(false)
        console.log("Bağlantı kesildi.")
      })

      socket.on("activeApp", (data) => {
        console.log("Aktif uygulama verisi geldi:", data)
      })
    }

    init()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  return { connected }
}

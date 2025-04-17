import { Server } from "socket.io"
import type { NextApiRequest, NextApiResponse } from "next"
import { fetchAktifUygulamalar, fetchAktiflikDurumu, fetchEtkinlikSuresi } from "@/lib/data"

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: {
      io?: Server
      on: (event: string, callback: () => void) => void
    }
  }
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket?.server) {
    res.status(500).end("Sunucu soketi mevcut değil.")
    return
  }

  if (res.socket.server.io) {
    console.log("Socket.IO already running")
    res.end()
    return
  }

  console.log("Setting up Socket.IO server...")

  const io = new Server(res.socket.server as any)
  res.socket.server.io = io

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Bağlantı kurulduğunda tüm verileri gönder
    sendInitialData(socket)

    // İstemci aktif uygulamaları istediğinde
    socket.on("getAktifUygulamalar", () => {
      sendAktifUygulamalar(socket)
    })

    // İstemci aktiflik durumlarını istediğinde
    socket.on("getAktiflikDurumu", () => {
      sendAktiflikDurumu(socket)
    })

    // İstemci etkinlik sürelerini istediğinde
    socket.on("getEtkinlikSuresi", () => {
      sendEtkinlikSuresi(socket)
    })

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  // Veritabanı değişikliklerini kontrol eden ve yayınlayan interval
  const intervalId = setInterval(async () => {
    try {
      // Aktif uygulamaları kontrol et ve yayınla
      const aktifUygulamalar = await fetchAktifUygulamalar()
      io.emit("aktifUygulamalar", aktifUygulamalar)

      try {
        // Aktiflik durumlarını kontrol et ve yayınla
        const aktiflikDurumu = await fetchAktiflikDurumu()
        io.emit("aktiflikDurumu", aktiflikDurumu)
      } catch (error) {
        console.error("Error fetching aktiflik durumu:", error)
      }

      try {
        // Etkinlik sürelerini kontrol et ve yayınla
        const etkinlikSuresi = await fetchEtkinlikSuresi()
        io.emit("etkinlikSuresi", etkinlikSuresi)
      } catch (error) {
        console.error("Error fetching etkinlik suresi:", error)
      }

      console.log("Data sent to all clients:", new Date().toISOString())
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, 2000) // 2 saniyede bir kontrol et

  // Sunucu kapandığında interval'i temizle
  res.socket.server.on("close", () => {
    clearInterval(intervalId)
  })

  console.log("Socket.IO server started")
  res.end()
}

// Bağlantı kurulduğunda ilk verileri gönder
async function sendInitialData(socket: any) {
  try {
    await sendAktifUygulamalar(socket)

    try {
      await sendAktiflikDurumu(socket)
    } catch (error) {
      console.error("Error sending aktiflik durumu:", error)
    }

    try {
      await sendEtkinlikSuresi(socket)
    } catch (error) {
      console.error("Error sending etkinlik suresi:", error)
    }
  } catch (error) {
    console.error("Error sending initial data:", error)
  }
}

// Aktif uygulamaları gönder
async function sendAktifUygulamalar(socket: any) {
  try {
    const data = await fetchAktifUygulamalar()
    socket.emit("aktifUygulamalar", data)
    console.log("AktifUygulamalar sent to client:", socket.id)
  } catch (error) {
    console.error("Error sending aktifUygulamalar:", error)
  }
}

// Aktiflik durumlarını gönder
async function sendAktiflikDurumu(socket: any) {
  try {
    const data = await fetchAktiflikDurumu()
    socket.emit("aktiflikDurumu", data)
    console.log("AktiflikDurumu sent to client:", socket.id)
  } catch (error) {
    console.error("Error sending aktiflikDurumu:", error)
  }
}

// Etkinlik sürelerini gönder
async function sendEtkinlikSuresi(socket: any) {
  try {
    const data = await fetchEtkinlikSuresi()
    socket.emit("etkinlikSuresi", data)
    console.log("EtkinlikSuresi sent to client:", socket.id)
  } catch (error) {
    console.error("Error sending etkinlikSuresi:", error)
  }
}

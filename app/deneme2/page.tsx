"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/useSocket"

export default function Home() {
  const { connected } = useSocket()
  const [appData, setAppData] = useState<any>(null)

  useEffect(() => {
    const socket = require("socket.io-client").io()

    socket.on("activeApp", (data: any) => {
      setAppData(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <main>
      <h1>Socket.IO Testi</h1>
      <p>Durum: {connected ? "Bağlı ✅" : "Bağlı değil ❌"}</p>

      {appData && (
        <div>
          <p><strong>Başlık:</strong> {appData.title}</p>
          <p><strong>Saat:</strong> {appData.time}</p>
        </div>
      )}
    </main>
  )
}
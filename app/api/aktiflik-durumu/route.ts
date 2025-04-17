import { updateAktiflikDurumu } from "@/lib/data"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { id, durum } = await request.json()

    if (!id || !durum) {
      return NextResponse.json({ error: "ID ve durum gereklidir" }, { status: 400 })
    }

    const success = await updateAktiflikDurumu(id, durum)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Durum güncellenemedi" }, { status: 500 })
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "İstek işlenemedi" }, { status: 500 })
  }
}

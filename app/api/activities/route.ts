import { fetchAktifUygulamalar } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const activities = await fetchAktifUygulamalar()
    return NextResponse.json(activities)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 })
  }
}

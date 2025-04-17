import { type NextRequest, NextResponse } from "next/server"
import { poolPromise } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get("username")
    const appName = searchParams.get("appName")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const pool = await poolPromise

    // Daha güvenli bir sorgu oluşturalım
    let query = "SELECT * FROM durum2 WHERE 1=1"
    const params: any[] = []

    // Parametreleri güvenli bir şekilde ekleyelim
    if (username) {
      query += " AND Username = @username"
      params.push({ name: "username", value: username })
    }

    if (appName) {
      query += " AND AppName = @appName"
      params.push({ name: "appName", value: appName })
    }

    if (startDate) {
      query += " AND Date >= @startDate"
      params.push({ name: "startDate", value: startDate })
    }

    if (endDate) {
      query += " AND Date <= @endDate"
      params.push({ name: "endDate", value: endDate })
    }

    // Sıralama ekleyelim
    query += " ORDER BY Date DESC"

    // Sorguyu hazırlayalım
    const req = pool.request()

    // Parametreleri ekleyelim
    params.forEach((param) => {
      req.input(param.name, param.value)
    })

    console.log("Executing SQL query:", query)
    const result = await req.query(query)
    console.log("Query result count:", result.recordset.length)

    return NextResponse.json(result.recordset)
  } catch (error) {
    console.error("Durumları alırken hata:", error)
    return NextResponse.json({ error: "Veri alınamadı", details: error }, { status: 500 })
  }
}

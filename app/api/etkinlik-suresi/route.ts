import sql from "mssql"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// SQL Server bağlantı yapılandırması
const config = {
  user: "alperrr",
  password: "12345678",
  server: "DESKTOP-KA6SKM6",
  database: "UserActivityDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
}

// Toplam süreyi saat:dakika formatına dönüştüren yardımcı fonksiyon
function formatToplamSure(toplamSure: number): string {
  // Toplam süre dakika cinsinden olduğunu varsayalım
  const saat = Math.floor(toplamSure / 60)
  const dakika = toplamSure % 60

  // Saat ve dakikayı iki haneli olarak formatla
  return `${saat.toString().padStart(2, "0")}:${dakika.toString().padStart(2, "0")}`
}

export async function GET() {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    // Etkinlik sürelerini en son eklenen sırasına göre getir
    const result = await pool
      .request()
      .query("SELECT Id, Username, Date, ToplamSure FROM EtkinlikSuresi ORDER BY Id DESC")

    const etkinlikSuresi = result.recordset.map((record) => ({
      id: record.Id,
      username: record.Username,
      date: record.Date,
      toplamSure: record.ToplamSure,
      formattedSure: formatToplamSure(record.ToplamSure)
    }))

    return NextResponse.json(etkinlikSuresi)
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ error: "Veri alınamadı" }, { status: 500 })
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

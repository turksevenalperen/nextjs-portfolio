import sql from "mssql"
import type { AktifUygulama, UserActivity, AktiflikDurumu, EtkinlikSuresi } from "./types"

// SQL Server bağlantı yapılandırması
const config = {
  user: "alperrr",
  password: "12345678",
  server: "DESKTOP-KA6SKM6",
  database: "UserActivityDB", // Veritabanı adınız
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
}

// Eski fonksiyonu da tutalım (geriye dönük uyumluluk için)
export async function fetchUserActivities(): Promise<UserActivity[]> {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    const result = await pool
      .request()
      .query("SELECT Id, Username, AppName, Duration, Date FROM durum2 ORDER BY Id DESC")

    return result.recordset.map((record) => ({
      id: record.Id,
      username: record.Username,
      appName: record.AppName,
      duration: record.Duration,
      date: record.Date,
    }))
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

// Aktif uygulamaları getiren fonksiyon
export async function fetchAktifUygulamalar(): Promise<AktifUygulama[]> {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    // Aktif uygulamaları en son eklenen sırasına göre getir
    const result = await pool
      .request()
      .query("SELECT Id, UserId, Username, AktifUygulama, Date FROM aktif_uygulama ORDER BY Id DESC")

    return result.recordset.map((record) => ({
      id: record.Id,
      userId: record.UserId,
      username: record.Username,
      aktifUygulama: record.AktifUygulama,
      date: record.Date,
    }))
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

// Aktiflik durumlarını getiren fonksiyon
export async function fetchAktiflikDurumu(): Promise<AktiflikDurumu[]> {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    // Aktiflik durumlarını en son eklenen sırasına göre getir
    const result = await pool
      .request()
      .query("SELECT Id, UserId, Username, Durum, Tarih FROM aktıflık_durumu ORDER BY Id DESC")

    return result.recordset.map((record) => ({
      id: record.Id,
      userId: record.UserId,
      username: record.Username,
      durum: record.Durum,
      tarih: record.Tarih,
    }))
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

// Aktiflik durumunu güncelleyen fonksiyon
export async function updateAktiflikDurumu(id: number, durum: string): Promise<boolean> {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    // Aktiflik durumunu güncelle
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("durum", sql.VarChar(10), durum)
      .query("UPDATE aktıflık_durumu SET Durum = @durum, Tarih = GETDATE() WHERE Id = @id")

    return true
  } catch (error) {
    console.error("Database update error:", error)
    return false
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

// Etkinlik sürelerini getiren fonksiyon
export async function fetchEtkinlikSuresi(): Promise<EtkinlikSuresi[]> {
  let pool: sql.ConnectionPool | null = null

  try {
    pool = await new sql.ConnectionPool(config).connect()
    // Etkinlik sürelerini en son eklenen sırasına göre getir
    const result = await pool
      .request()
      .query("SELECT Id, Username, Date, ToplamSure FROM EtkinlikSuresi ORDER BY Id DESC")

    return result.recordset.map((record) => ({
      id: record.Id,
      username: record.Username,
      date: record.Date,
      toplamSure: record.ToplamSure,
    }))
  } catch (error) {
    console.error("Database connection error:", error)
    return []
  } finally {
    if (pool) {
      await pool.close()
    }
  }
}

// Toplam süreyi saat:dakika formatına dönüştüren yardımcı fonksiyon
export function formatToplamSure(toplamSure: number): string {
  // Toplam süre dakika cinsinden olduğunu varsayalım
  const saat = Math.floor(toplamSure / 60)
  const dakika = toplamSure % 60

  // Saat ve dakikayı iki haneli olarak formatla
  return `${saat.toString().padStart(2, "0")}:${dakika.toString().padStart(2, "0")}`
}

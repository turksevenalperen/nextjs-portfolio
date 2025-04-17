import sql from "mssql"

const config: sql.config = {
  server: "DESKTOP-KA6SKM6",
  database: "UserActivityDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000, // 30 saniye bağlantı zaman aşımı
    requestTimeout: 30000, // 30 saniye sorgu zaman aşımı
  },
  authentication: {
    type: "ntlm",
    options: {
      domain: "", // boş bırakabilirsin
      userName: "alper",
      password: "332633",
    },
  },
}

// Bağlantı havuzunu oluştur
export const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✔️ SQL Server bağlantısı başarılı")
    return pool
  })
  .catch((err) => {
    console.error("SQL Server bağlantı hatası:", err)
    throw err
  })

// Bağlantıyı test etmek için yardımcı fonksiyon
export async function testConnection() {
  try {
    const pool = await poolPromise
    const result = await pool.request().query("SELECT 1 as test")
    return { success: true, message: "Bağlantı başarılı", data: result.recordset }
  } catch (error) {
    console.error("Bağlantı testi hatası:", error)
    return { success: false, message: "Bağlantı başarısız", error }
  }
}

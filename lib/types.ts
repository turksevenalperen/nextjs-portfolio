// Mevcut UserActivity tipini koruyalım (eski tablo için)
export interface UserActivity {
  id: number
  username: string
  appName: string
  duration: number
  date: string
}

// Yeni aktif_uygulama tablosu için tip tanımı
export interface AktifUygulama {
  id: number
  userId: number
  username: string
  aktifUygulama: string
  date: string
}

// Yeni aktiflik_durumu tablosu için tip tanımı
export interface AktiflikDurumu {
  id: number
  userId: number
  username: string
  durum: string
  tarih: string
}

// EtkinlikSuresi tablosu için tip tanımı
export interface EtkinlikSuresi {
  id: number
  username: string
  date: string
  toplamSure: number
}

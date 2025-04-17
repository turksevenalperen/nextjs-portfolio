"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DurumTable } from "../durum-table"
import { DateFilter } from "../date-filter"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Durum } from "@/lib/types/durum"

export default function RecordsPage() {
  const [durumlar, setDurumlar] = useState<Durum[]>([])
  const [filteredDurumlar, setFilteredDurumlar] = useState<Durum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  const fetchDurumlar = async (useMock = false) => {
    try {
      setLoading(true)
      setError(null)

      const url = useMock ? "/api/durumlar?mock=true" : "/api/durumlar"

      console.log(`Fetching data from API: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("API error response:", response.status, errorData)
        throw new Error(`Veri alınamadı: ${response.status}${errorData?.message ? ` - ${errorData.message}` : ""}`)
      }

      const data = await response.json()
      console.log(`Fetched ${data.length} records successfully`)

      if (useMock) {
        setUseMockData(true)
      }

      setDurumlar(data)
      setFilteredDurumlar(data)
    } catch (err: any) {
      console.error("Veri yükleme hatası:", err)
      setError(`Veri yüklenirken bir hata oluştu: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDurumlar()
  }, [])

  const handleDateFilterChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    if (!startDate && !endDate) {
      setFilteredDurumlar(durumlar)
      return
    }

    const filtered = durumlar.filter((item) => {
      const itemDate = new Date(item.Date)

      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate
      } else if (startDate) {
        return itemDate >= startDate
      } else if (endDate) {
        return itemDate <= endDate
      }

      return true
    })

    setFilteredDurumlar(filtered)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Tüm Kayıtlar</h1>

          {useMockData && (
            <Alert className="max-w-fit p-2">
              <Database className="h-4 w-4" />
              <AlertTitle className="text-xs">Demo Modu</AlertTitle>
              <AlertDescription className="text-xs">Örnek veriler gösteriliyor</AlertDescription>
            </Alert>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-lg">Veriler yükleniyor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={() => fetchDurumlar()}>Yeniden Dene</Button>

              <Button variant="outline" onClick={() => fetchDurumlar(true)}>
                Demo Verisi Kullan
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Aktivite Kayıtları</CardTitle>
              <CardDescription>
                {useMockData
                  ? "Demo modu: Örnek kullanıcı aktivite kayıtları gösteriliyor"
                  : "Tüm kullanıcıların uygulama kullanım kayıtları"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <DateFilter onFilterChange={handleDateFilterChange} />
              </div>
              <DurumTable durumlar={filteredDurumlar} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

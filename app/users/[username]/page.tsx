"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DurumTable } from "@/app/durum-table"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Durum } from "@/lib/types/durum"
import { Doughnut } from "react-chartjs-2"
import { ArcElement } from "chart.js"
import ChartJS from "chart.js/auto"

ChartJS.register(ArcElement)

export default function UserDetailsPage() {
  const params = useParams()
  const username = params.username as string

  const [durumlar, setDurumlar] = useState<Durum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  const fetchDurumlar = async (useMock = false) => {
    try {
      setLoading(true)
      setError(null)

      const url = useMock
        ? `/api/durumlar?mock=true&username=${encodeURIComponent(username)}`
        : `/api/durumlar?username=${encodeURIComponent(username)}`

      console.log(`Fetching data from API: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("API error response:", response.status, errorData)
        throw new Error(`Veri alınamadı: ${response.status}${errorData?.message ? ` - ${errorData.message}` : ""}`)
      }

      const data = await response.json()
      console.log(`Fetched ${data.length} records for user ${username}`)

      if (useMock) {
        setUseMockData(true)
      }

      setDurumlar(data)
    } catch (err: any) {
      console.error("Veri yükleme hatası:", err)
      setError(`Veri yüklenirken bir hata oluştu: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDurumlar()
  }, [username])

  // Prepare app usage chart data
  const prepareAppUsageData = () => {
    if (!durumlar.length) return { labels: [], datasets: [] }

    // Group data by app name
    const appGroups = durumlar.reduce(
      (groups, item) => {
        if (!groups[item.AppName]) {
          groups[item.AppName] = 0
        }
        groups[item.AppName] += item.Duration
        return groups
      },
      {} as Record<string, number>,
    )

    // Sort by duration
    const sortedApps = Object.entries(appGroups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // Top 5 apps

    return {
      labels: sortedApps.map(([app]) => app),
      datasets: [
        {
          data: sortedApps.map(([_, duration]) => duration),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const appUsageData = prepareAppUsageData()

  // Calculate user statistics
  const calculateUserStats = () => {
    if (!durumlar.length) return { totalApps: 0, totalDuration: 0, avgDuration: 0 }

    const uniqueApps = [...new Set(durumlar.map((item) => item.AppName))]
    const totalDuration = durumlar.reduce((sum, item) => sum + item.Duration, 0)
    const avgDuration = totalDuration / durumlar.length

    return {
      totalApps: uniqueApps.length,
      totalDuration,
      avgDuration: avgDuration.toFixed(1),
    }
  }

  const userStats = calculateUserStats()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{decodeURIComponent(username)} Kullanıcı Detayları</h1>

          {useMockData && (
            <Alert  className="max-w-fit p-2">
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-red-500">
              <p className="text-lg">{error}</p>
              <div className="mt-4 flex gap-4 justify-center">
                <Button onClick={() => fetchDurumlar()}>Yeniden Dene</Button>
                <Button variant="outline" onClick={() => fetchDurumlar(true)}>
                  Demo Verisi Kullan
                </Button>
              </div>
            </div>
          </div>
        ) : durumlar.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Bu kullanıcı için kayıt bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Kullanılan Uygulamalar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalApps}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Süre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.totalDuration} dk</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ortalama Süre</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.avgDuration} dk</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Uygulama Kullanım Dağılımı</CardTitle>
                  <CardDescription>En çok kullanılan uygulamalar</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-64 h-64">
                    <Doughnut
                      data={appUsageData}
                      options={{
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kullanıcı Aktiviteleri</CardTitle>
                  <CardDescription>Tüm aktivite kayıtları</CardDescription>
                </CardHeader>
                <CardContent>
                  <DurumTable durumlar={durumlar} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

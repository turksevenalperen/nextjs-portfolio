"use client"

import { useState } from "react"
import { Users, Briefcase, Clock, ArrowUp, ArrowDown, Activity } from "lucide-react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Chart.js bileşenlerini kaydet
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Line chart verileri
  const lineChartData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Çalışan Performansı",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  // Bar chart verileri
  const barChartData = {
    labels: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"],
    datasets: [
      {
        label: "Tamamlanan Görevler",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  }

  // Takım performansı verileri
  const teamPerformance = [
    {
      name: "Yazılım Ekibi",
      progress: 85,
      members: 8,
      tasks: 24,
    },
    {
      name: "Tasarım Ekibi",
      progress: 72,
      members: 5,
      tasks: 18,
    },
    {
      name: "Pazarlama Ekibi",
      progress: 64,
      members: 6,
      tasks: 15,
    },
  ]

  // Son aktiviteler
  const recentActivities = [
    {
      user: "Ahmet Yılmaz",
      action: "Yeni bir görev oluşturdu",
      time: "10 dakika önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      user: "Ayşe Demir",
      action: "Bir görevi tamamladı",
      time: "30 dakika önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      user: "Mehmet Kaya",
      action: "Bir toplantı planladı",
      time: "1 saat önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      user: "Zeynep Şahin",
      action: "Bir dosya yükledi",
      time: "2 saat önce",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        {/* Özet Kartları */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Çalışan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +2
                </span>{" "}
                geçen aydan beri
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +3
                </span>{" "}
                geçen aydan beri
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ortalama Çalışma</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.5 saat</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  <ArrowDown className="mr-1 h-3 w-3" />
                  -0.2
                </span>{" "}
                geçen aydan beri
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Görevler</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +24
                </span>{" "}
                geçen aydan beri
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grafikler */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Çalışan Performansı</CardTitle>
              <CardDescription>Son 6 aydaki performans değerlendirmesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={lineChartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Haftalık Görev Tamamlama</CardTitle>
              <CardDescription>Bu haftaki tamamlanan görev sayısı</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={barChartData} />
            </CardContent>
          </Card>
        </div>

        {/* Sekmeler */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Takım Performansı</TabsTrigger>
            <TabsTrigger value="analytics">Son Aktiviteler</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Takım Performansı</CardTitle>
                <CardDescription>Takımların ilerleme durumu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformance.map((team) => (
                    <div key={team.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.progress}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${team.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>{team.members} üye</div>
                        <div>{team.tasks} görev</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>Sistemdeki son kullanıcı aktiviteleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}


"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, Clock, ArrowRight } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Örnek devam verileri
const attendanceData = [
  {
    id: 1,
    user: {
      name: "Ahmet Yılmaz",
      image: "/placeholder.svg?height=32&width=32",
      department: "Teknoloji",
    },
    status: "Çalışıyor",
    checkIn: "08:30",
    checkOut: null,
    totalHours: null,
  },
  {
    id: 2,
    user: {
      name: "Ayşe Demir",
      image: "/placeholder.svg?height=32&width=32",
      department: "Tasarım",
    },
    status: "Çalışıyor",
    checkIn: "09:15",
    checkOut: null,
    totalHours: null,
  },
  {
    id: 3,
    user: {
      name: "Mehmet Kaya",
      image: "/placeholder.svg?height=32&width=32",
      department: "Yönetim",
    },
    status: "Mola",
    checkIn: "08:45",
    checkOut: null,
    totalHours: null,
  },
  {
    id: 4,
    user: {
      name: "Zeynep Şahin",
      image: "/placeholder.svg?height=32&width=32",
      department: "Veri",
    },
    status: "Çalışıyor",
    checkIn: "08:55",
    checkOut: null,
    totalHours: null,
  },
  {
    id: 5,
    user: {
      name: "Ali Öztürk",
      image: "/placeholder.svg?height=32&width=32",
      department: "Teknoloji",
    },
    status: "Ayrıldı",
    checkIn: "08:30",
    checkOut: "17:15",
    totalHours: "8 saat 45 dakika",
  },
  {
    id: 6,
    user: {
      name: "Fatma Yıldız",
      image: "/placeholder.svg?height=32&width=32",
      department: "İK",
    },
    status: "İzinli",
    checkIn: null,
    checkOut: null,
    totalHours: null,
  },
  {
    id: 7,
    user: {
      name: "Mustafa Çelik",
      image: "/placeholder.svg?height=32&width=32",
      department: "Pazarlama",
    },
    status: "Çalışıyor",
    checkIn: "09:30",
    checkOut: null,
    totalHours: null,
  },
  {
    id: 8,
    user: {
      name: "Elif Aydın",
      image: "/placeholder.svg?height=32&width=32",
      department: "Satış",
    },
    status: "Ayrıldı",
    checkIn: "09:00",
    checkOut: "18:00",
    totalHours: "9 saat",
  },
]

// Özet verileri
const summaryData = {
  present: 5,
  absent: 1,
  onBreak: 1,
  left: 2,
  averageHours: "8.5",
}

export default function TimePage() {
  const [date, setDate] = useState<Date>(new Date())

  // Durum rengini belirle
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Çalışıyor":
        return "bg-green-500"
      case "Mola":
        return "bg-yellow-500"
      case "Ayrıldı":
        return "bg-blue-500"
      case "İzinli":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Zaman Takibi</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full sm:w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: tr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Özet Kartları */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mevcut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.present}</div>
              <p className="text-xs text-muted-foreground">çalışan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">İzinli</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.absent}</div>
              <p className="text-xs text-muted-foreground">çalışan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Molada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.onBreak}</div>
              <p className="text-xs text-muted-foreground">çalışan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ayrıldı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.left}</div>
              <p className="text-xs text-muted-foreground">çalışan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ortalama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.averageHours}</div>
              <p className="text-xs text-muted-foreground">saat/gün</p>
            </CardContent>
          </Card>
        </div>

        {/* Devam Durumu Kartları */}
        <Card>
          <CardHeader>
            <CardTitle>Devam Durumu</CardTitle>
            <CardDescription>{format(date, "d MMMM yyyy, EEEE", { locale: tr })} tarihli devam durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((attendance) => (
                <div
                  key={attendance.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={attendance.user.image} alt={attendance.user.name} />
                      <AvatarFallback>{attendance.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attendance.user.name}</p>
                      <p className="text-xs text-muted-foreground">{attendance.user.department}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Badge className={getStatusColor(attendance.status)}>{attendance.status}</Badge>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attendance.checkIn ? attendance.checkIn : "---"}</span>
                      {attendance.checkOut && (
                        <>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{attendance.checkOut}</span>
                        </>
                      )}
                    </div>
                    {attendance.totalHours && (
                      <span className="text-sm text-muted-foreground">Toplam: {attendance.totalHours}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


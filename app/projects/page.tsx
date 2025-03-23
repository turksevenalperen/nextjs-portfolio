"use client"

import { useState } from "react"
import { Search, Clock, Users, CheckCircle } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Örnek proje verileri
const projectsData = [
  {
    id: 1,
    name: "Mobil Uygulama Geliştirme",
    description: "Şirket içi mobil uygulama geliştirme projesi",
    status: "Devam Ediyor",
    progress: 75,
    dueDate: "15 Haziran 2023",
    team: [
      { name: "Ahmet Yılmaz", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ayşe Demir", image: "/placeholder.svg?height=32&width=32" },
      { name: "Mehmet Kaya", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 24, total: 32 },
  },
  {
    id: 2,
    name: "Web Sitesi Yenileme",
    description: "Şirket web sitesinin yeniden tasarımı",
    status: "Devam Ediyor",
    progress: 45,
    dueDate: "30 Haziran 2023",
    team: [
      { name: "Zeynep Şahin", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ali Öztürk", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 12, total: 28 },
  },
  {
    id: 3,
    name: "Veri Analizi Platformu",
    description: "Müşteri verilerinin analizi için platform geliştirme",
    status: "Planlama",
    progress: 15,
    dueDate: "15 Temmuz 2023",
    team: [
      { name: "Fatma Yıldız", image: "/placeholder.svg?height=32&width=32" },
      { name: "Mustafa Çelik", image: "/placeholder.svg?height=32&width=32" },
      { name: "Elif Aydın", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 5, total: 35 },
  },
  {
    id: 4,
    name: "CRM Entegrasyonu",
    description: "Müşteri ilişkileri yönetimi sistemi entegrasyonu",
    status: "Tamamlandı",
    progress: 100,
    dueDate: "1 Haziran 2023",
    team: [
      { name: "Ahmet Yılmaz", image: "/placeholder.svg?height=32&width=32" },
      { name: "Zeynep Şahin", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 18, total: 18 },
  },
  {
    id: 5,
    name: "E-ticaret Platformu",
    description: "Şirket ürünleri için e-ticaret platformu",
    status: "Devam Ediyor",
    progress: 60,
    dueDate: "10 Temmuz 2023",
    team: [
      { name: "Ayşe Demir", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ali Öztürk", image: "/placeholder.svg?height=32&width=32" },
      { name: "Fatma Yıldız", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 21, total: 35 },
  },
  {
    id: 6,
    name: "İnsan Kaynakları Sistemi",
    description: "İK süreçlerinin dijitalleştirilmesi",
    status: "Planlama",
    progress: 10,
    dueDate: "20 Temmuz 2023",
    team: [
      { name: "Mehmet Kaya", image: "/placeholder.svg?height=32&width=32" },
      { name: "Fatma Yıldız", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 3, total: 28 },
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Arama sorgusuna göre projeleri filtreliyoruz
  const filteredProjects = projectsData.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Proje durumuna göre badge rengi
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-500"
      case "Devam Ediyor":
        return "bg-blue-500"
      case "Planlama":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Projeler</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Proje ara..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Proje Kartları */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                {/* İlerleme çubuğu */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>İlerleme</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Görev durumu */}
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  <span>
                    {project.tasks.completed} / {project.tasks.total} görev tamamlandı
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col items-start gap-2">
                {/* Ekip üyeleri */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Ekip:</span>
                  <div className="flex -space-x-2">
                    {project.team.map((member, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {/* Bitiş tarihi */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Bitiş: {project.dueDate}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}


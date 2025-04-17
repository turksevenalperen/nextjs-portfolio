"use client"

import { useState } from "react"
import { Search, Users, CheckCircle, User } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Örnek takım verileri
const teamsData = [
  {
    id: 1,
    name: "Yazılım Ekibi",
    description: "Frontend ve backend geliştirme ekibi",
    members: [
      { name: "Ahmet Yılmaz", role: "Takım Lideri", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ayşe Demir", role: "Frontend Geliştirici", image: "/placeholder.svg?height=32&width=32" },
      { name: "Mehmet Kaya", role: "Backend Geliştirici", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ali Öztürk", role: "Mobil Geliştirici", image: "/placeholder.svg?height=32&width=32" },
    ],
    stats: {
      projects: 5,
      completedTasks: 87,
      totalTasks: 120,
    },
  },
  {
    id: 2,
    name: "Tasarım Ekibi",
    description: "UI/UX ve grafik tasarım ekibi",
    members: [
      { name: "Zeynep Şahin", role: "Tasarım Lideri", image: "/placeholder.svg?height=32&width=32" },
      { name: "Seda Arslan", role: "UI/UX Tasarımcı", image: "/placeholder.svg?height=32&width=32" },
      { name: "Emre Yıldız", role: "Grafik Tasarımcı", image: "/placeholder.svg?height=32&width=32" },
    ],
    stats: {
      projects: 3,
      completedTasks: 45,
      totalTasks: 68,
    },
  },
  {
    id: 3,
    name: "Pazarlama Ekibi",
    description: "Dijital pazarlama ve içerik ekibi",
    members: [
      { name: "Mustafa Çelik", role: "Pazarlama Lideri", image: "/placeholder.svg?height=32&width=32" },
      { name: "Elif Aydın", role: "İçerik Uzmanı", image: "/placeholder.svg?height=32&width=32" },
      { name: "Burak Demir", role: "Sosyal Medya Uzmanı", image: "/placeholder.svg?height=32&width=32" },
      { name: "Ceren Yılmaz", role: "SEO Uzmanı", image: "/placeholder.svg?height=32&width=32" },
    ],
    stats: {
      projects: 4,
      completedTasks: 62,
      totalTasks: 95,
    },
  },
  {
    id: 4,
    name: "İnsan Kaynakları Ekibi",
    description: "İşe alım ve çalışan ilişkileri ekibi",
    members: [
      { name: "Fatma Yıldız", role: "İK Lideri", image: "/placeholder.svg?height=32&width=32" },
      { name: "Hasan Kara", role: "İşe Alım Uzmanı", image: "/placeholder.svg?height=32&width=32" },
      { name: "Gizem Şahin", role: "Çalışan İlişkileri", image: "/placeholder.svg?height=32&width=32" },
    ],
    stats: {
      projects: 2,
      completedTasks: 28,
      totalTasks: 35,
    },
  },
]

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  
  const filteredTeams = teamsData.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.members.some(
        (member)=>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.role.toLowerCase().includes(searchQuery.toLowerCase())

      ),
      )
  
return(

  <DashboardLayout>
     <div className="flex flex-col gap-5">

     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <h1 className="text-2xl font-bold tracking-tight">Takımlar</h1>
        <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

        <input 
        placeholder="Takım vey Üye ara..."
        className="pl-8" 
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
        />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      {filteredTeams.map ((team) =>(
      <Card key={team.id} className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
              {team.name}
           

          </CardTitle>
          <p className="text-sm text-muted-foreground" >{team.description}</p>
        </CardHeader>
        <CardContent className="flex-1">
        <h3 className="mb-2 text-sm font-medium">Takım Üyeleri</h3>
        <div className="space-y-3">
          {team.members.map((member, index)=>(
            <div key={index} className="flex items-center gap-3">
              <Avatar className="h-8 w-8" >
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>
                  {member.name.substring(0,2)}
                </AvatarFallback>
              </Avatar>
              <div>
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>


            </div>
          ))}
        </div>


        </CardContent>
        <CardFooter>
        <div className="grid w-full grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{team.stats.projects}</span>
                    <span className="text-xs text-muted-foreground">Projeler</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">{team.members.length}</span>
                    <span className="text-xs text-muted-foreground">Üyeler</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">
                      {Math.round((team.stats.completedTasks / team.stats.totalTasks) * 100)}%
                    </span>
                    <span className="text-xs text-muted-foreground">Tamamlama</span>
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center">
                      <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                      {team.stats.completedTasks} görev tamamlandı
                    </span>
                    <span>{team.stats.totalTasks} toplam görev</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(team.stats.completedTasks / team.stats.totalTasks) * 100}%` }}
                    />
                  </div>
                </div>

        </CardFooter>
      </Card>
      ))}


    </div>

  


  </DashboardLayout>
)
}
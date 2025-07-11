"use client"

import { useState, useEffect } from "react"
import { Search, Clock, Users, CheckCircle, Plus } from "lucide-react"
import { format } from "date-fns"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAdminMode } from "@/hooks/use-admin-mode"
import { useAuth } from "@/hooks/use-auth"


// Basit bir küçük avatar bileşeni oluşturalım (shadcn/ui Avatar çalışmıyorsa)
function SimpleAvatar({ name, image, className = "" }: { name: string; image?: string; className?: string }) {
  // İsmin baş harflerini al
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-primary text-primary-foreground rounded-full h-6 w-6 border-2 border-background text-xs font-medium ${className}`}
    >
      {initials}
    </div>
  )
}


const projectsData=[
  {
    id: 1,
    name: "Mobil Uygulama Geliştirmeeeeeeeeeeeee",
    description: "Şirket içi mobil uygulama geliştirme projesi",
    status: "Devam Ediyor",
    progress: 92,
    dueDate: "15 Haziran 2026",
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
    dueDate: "30 Haziran 2025",
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
    dueDate: "15 Temmuz 2025",
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
    progress: 80,
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
    progress: 100,
    dueDate: "20 Temmuz 2023",
    team: [
      { name: "Mehmet Kaya", image: "/placeholder.svg?height=32&width=32" },
      { name: "Fatma Yıldız", image: "/placeholder.svg?height=32&width=32" },
    ],
    tasks: { completed: 3, total: 28 },
  },


]
const allTeamMembers = [
  { id: 1, name: "Ahmet Yılmaz", image: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "Ayşe Demir", image: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "Mehmet Kaya", image: "/placeholder.svg?height=32&width=32" },
  { id: 4, name: "Zeynep Şahin", image: "/placeholder.svg?height=32&width=32" },
  { id: 5, name: "Ali Öztürk", image: "/placeholder.svg?height=32&width=32" },
  { id: 6, name: "Fatma Yıldız", image: "/placeholder.svg?height=32&width=32" },
  { id: 7, name: "Mustafa Çelik", image: "/placeholder.svg?height=32&width=32" },
  { id: 8, name: "Elif Aydın", image: "/placeholder.svg?height=32&width=32" },
]

const projectTypes = [
  "Mobil Uygulama",
  "Web Geliştirme",
  "Veri Analizi",
  "Tasarım",
  "Pazarlama",
  "İnsan Kaynakları",
  "Finans",
  "Diğer",
]

const STORAGE_KEY = "projects-data"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<typeof projectsData>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [useCustomAvatar, setUseCustomAvatar] = useState(true)
 
  const [newProject, setNewProject] = useState({

    name: "",
    description: "",
    type: "",
    teamSize: "1",
    teamMembers: ["", "", ""],
    dueDate: new Date(),
  })

  const { isAdminMode } = useAdminMode()
  const { isAdmin } = useAuth()

  useEffect(() => {
    const loadProjectsFromStorage = () => {
      try {
        const storedProjects = localStorage.getItem(STORAGE_KEY)

        if (storedProjects) {
          setProjects(JSON.parse(storedProjects))
        } else {
          setProjects(projectsData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData))
        }

}catch (error) {
  console.error("Proje verileri yüklenirken hata oluştu:", error)
  setProjects(projectsData)
}
    }
    loadProjectsFromStorage()
  } ,[])
  
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    }
  }, [projects])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )
const getStatusColor = (status :string) => {
  switch(status)
  {
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
const handleInputChange = (field: string, value: any) => {
  setNewProject({
    ...newProject,
    [field]: value,
  })
}
const handleTeamMemberChange = (index: number, value: string) => {
  const updatedTeamMembers = [...newProject.teamMembers]
  updatedTeamMembers[index] = value
  setNewProject({
    ...newProject,
    teamMembers: updatedTeamMembers,
  })
}
const  handleAddProject = () =>{

  const selectedTeamMembers =newProject.teamMembers
  .slice(0, Number.parseInt(newProject.teamSize))
  .map((memberId) => {
    const member = allTeamMembers.find((m) => m.id.toString()=== memberId)
    return member ? {name: member.name , image: member.image} : null
  })
  .filter(Boolean) as {name: string; image : string}[]


  const project = {
    id: projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
    name: newProject.name,
    description: `${newProject.type} projesi: ${newProject.description}`,
    status: "Planlama",
    progress: 0,
    dueDate: format(newProject.dueDate, "d MMMM yyyy"),
    team: selectedTeamMembers,
    tasks: { completed: 0, total: 0 },
  }
  setProjects([...projects, project])
  setNewProject({
    name: "",
    description: "",
    type: "",
    teamSize: "1",
    teamMembers: ["", "", ""],
    dueDate: new Date(),


  })
  setIsDialogOpen(false)


  }
  const toggleAvatarComponent = () => {
    setUseCustomAvatar((prev) => !prev)



}

const canEdit = isAdmin && isAdminMode


return (
  <DashboardLayout>
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Projeler</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Proje ara..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        
          {canEdit && (
            <Button onClick={() => setIsDialogOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              Proje Ekle
            </Button>
          )}
        </div>
      </div>

    
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

           
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>İlerleme</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>

            
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span>
                  {project.tasks.completed} / {project.tasks.total} görev tamamlandı
                </span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col items-start gap-2">
             
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Ekip:</span>
                <div className="flex -space-x-2">
                  {project.team.map((member, index) =>
                    useCustomAvatar ? (
                      <SimpleAvatar
                        key={index}
                        name={member.name}
                        image={member.image}
                        className="border-2 border-background"
                      />
                    ) : (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src="invalid-image-url" alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ),
                  )}
                </div>
              </div>

             
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Bitiş: {project.dueDate}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>

   
    {canEdit && (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Proje Ekle</DialogTitle>
            <DialogDescription>Yeni bir proje oluşturmak için aşağıdaki bilgileri doldurun.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Proje Adı</Label>
              <Input
                id="project-name"
                placeholder="Proje adını girin"
                value={newProject.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Proje Açıklaması</Label>
              <Input
                id="project-description"
                placeholder="Proje açıklamasını girin"
                value={newProject.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-type">Proje Türü</Label>
              <Select value={newProject.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Proje türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-size">Ekip Üye Sayısı</Label>
              <Select value={newProject.teamSize} onValueChange={(value) => handleInputChange("teamSize", value)}>
                <SelectTrigger id="team-size">
                  <SelectValue placeholder="Ekip üye sayısını seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Kişi</SelectItem>
                  <SelectItem value="2">2 Kişi</SelectItem>
                  <SelectItem value="3">3 Kişi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dinamik ekip üyesi seçimi */}
            {Array.from({ length: Number.parseInt(newProject.teamSize) }).map((_, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={`team-member-${index}`}>{`Ekip Üyesi ${index + 1}`}</Label>
                <Select
                  value={newProject.teamMembers[index]}
                  onValueChange={(value) => handleTeamMemberChange(index, value)}
                >
                  <SelectTrigger id={`team-member-${index}`}>
                    <SelectValue placeholder="Ekip üyesi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="due-date">Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Clock className="mr-2 h-4 w-4" />
                    {newProject.dueDate ? format(newProject.dueDate, "PPP") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newProject.dueDate}
                    onSelect={(date) => handleInputChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddProject}>Proje Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
  </DashboardLayout>
)
}



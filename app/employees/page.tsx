"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminMode } from "@/hooks/use-admin-mode"
import { useAuth } from "@/hooks/use-auth"
import { Plus } from "lucide-react"

const STORAGE_KEY = "employees-data"

function SimpleAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative inline-flex items-center justify-center overflow-hidden bg-primary text-primary-foreground rounded-full h-16 w-16 sm:h-20 sm:w-20 text-lg font-medium">
      {initials}
    </div>
  )
}

function DetailAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative inline-flex items-center justify-center overflow-hidden bg-primary text-primary-foreground rounded-full h-24 w-24 text-xl font-medium">
      {initials}
    </div>
  )
}

const employeesData = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    position: "Yazılım Geliştirici",
    department: "Teknoloji",
    email: "ahmet@iotech.com",
    phone: "+90 555 123 4567",
    image: "/placeholder.svg?height=300&width=300",
    description: "React ve Node.js uzmanı, 3 yıllık deneyime sahip.",
  },
  {
    id: 2,
    name: "Ayşe Demir",
    position: "UI/UX Tasarımcı",
    department: "Tasarım",
    email: "ayse@iotech.com",
    phone: "+90 555 234 5678",
    image: "/placeholder.svg?height=300&width=300",
    description: "Kullanıcı deneyimi ve arayüz tasarımı konusunda uzman.",
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    position: "Proje Yöneticisi",
    department: "Yönetim",
    email: "mehmet@iotech.com",
    phone: "+90 555 345 6789",
    image: "/placeholder.svg?height=300&width=300",
    description: "5 yıllık proje yönetimi deneyimine sahip.",
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    position: "Veri Analisti",
    department: "Veri",
    email: "zeynep@iotech.com",
    phone: "+90 555 456 7890",
    image: "/placeholder.svg?height=300&width=300",
    description: "Veri analizi ve raporlama konusunda uzman.",
  },
  {
    id: 5,
    name: "Ali Öztürk",
    position: "Mobil Geliştirici",
    department: "Teknoloji",
    email: "ali@iotech.com",
    phone: "+90 555 567 8901",
    image: "/placeholder.svg?height=300&width=300",
    description: "iOS ve Android uygulama geliştirme konusunda uzman.",
  },
  {
    id: 6,
    name: "Fatma Yıldız",
    position: "İnsan Kaynakları Uzmanı",
    department: "İK",
    email: "fatma@iotech.com",
    phone: "+90 555 678 9012",
    image: "/placeholder.svg?height=300&width=300",
    description: "İşe alım ve çalışan ilişkileri konusunda uzman.",
  },
  {
    id: 7,
    name: "Mustafa Çelik",
    position: "Pazarlama Uzmanı",
    department: "Pazarlama",
    email: "mustafa@iotech.com",
    phone: "+90 555 789 0123",
    image: "/placeholder.svg?height=300&width=300",
    description: "Dijital pazarlama ve marka yönetimi konusunda uzman.",
  },
  {
    id: 8,
    name: "Elif Aydın",
    position: "Müşteri İlişkileri",
    department: "Satış",
    email: "elif@iotech.com",
    phone: "+90 555 890 1234",
    image: "/placeholder.svg?height=300&width=300",
    description: "Müşteri ilişkileri ve satış konusunda uzman.",
  },
]

const departments = ["Teknoloji", "Tasarım", "Yönetim", "Veri", "İK", "Pazarlama", "Satış"]

const positions = [
  "Yazılım Geliştirici",
  "UI/UX Tasarımcı",
  "Proje Yöneticisi",
  "Veri Analisti",
  "Mobil Geliştirici",
  "İnsan Kaynakları Uzmanı",
  "Pazarlama Uzmanı",
  "Müşteri İlişkileri",
]

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employeesData)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [employees, setEmployees] = useState<typeof employeesData>([])

  const [useCustomAvatar, setUseCustomAvatar] = useState(true)

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    id: 0,
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    image: "/placeholder.svg?height=300&width=300",
    description: "",
  })

  const { isAdminMode } = useAdminMode()
  const { isAdmin } = useAuth()

  useEffect(() => {
    const loadEmployeesFromStorage = () => {
      try {
        const storedEmployees = localStorage.getItem(STORAGE_KEY)

        if (storedEmployees) {
          setEmployees(JSON.parse(storedEmployees))
        } else {
          setEmployees(employeesData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(employeesData))
        }
      } catch (error) {
        console.error("Çalışan verileri yüklenirken hata oluştu:", error)
        setEmployees(employeesData)
      }
    }

    loadEmployeesFromStorage()
  }, [])

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
    }
  }, [employees])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEmployeeClick = (employee: (typeof employeesData)[0]) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleAddEmployeeClick = () => {
    setIsAddEmployeeOpen(true)
    setIsEditing(false)
    setNewEmployee({
      id: employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      image: "/placeholder.svg?height=300&width=300",
      description: "",
    })
  }

  const handleEditEmployee = (employee: (typeof employeesData)[0]) => {
    setIsAddEmployeeOpen(true)
    setIsEditing(true)
    setNewEmployee(employee)
    setIsDialogOpen(false)
  }

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      setEmployees((prev) => prev.map((emp) => (emp.id === newEmployee.id ? newEmployee : emp)))
    } else {
      setEmployees((prev) => [...prev, newEmployee])
    }

    setIsAddEmployeeOpen(false)
    setNewEmployee({
      id: 0,
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      image: "/placeholder.svg?height=300&width=300",
      description: "",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const toggleAvatarComponent = () => {
    setUseCustomAvatar((prev) => !prev)
  }

  const canEdit = isAdmin && isAdminMode

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Çalışanlar</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Çalışan ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            
            {canEdit && (
              <Button onClick={handleAddEmployeeClick} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Çalışan Ekle</span>
              </Button>
            )}
          </div>
        </div>

        

       
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleEmployeeClick(employee)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center gap-4">
                  {useCustomAvatar ? (
                    <SimpleAvatar name={employee.name} image={employee.image} />
                  ) : (
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                      <AvatarImage src="invalid-image-url" alt={employee.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {employee.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1 text-center">
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <p className="text-xs text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

       
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedEmployee.name}</DialogTitle>
                  <DialogDescription>{selectedEmployee.position}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row gap-4 py-4">
                  {useCustomAvatar ? (
                    <DetailAvatar name={selectedEmployee.name} image={selectedEmployee.image} />
                  ) : (
                    <Avatar className="h-24 w-24 mx-auto sm:mx-0">
                      <AvatarImage src="invalid-image-url" alt={selectedEmployee.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {selectedEmployee.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Departman</h4>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">E-posta</h4>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.email}</p>
                      
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Telefon</h4>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Hakkında</h4>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.description}</p>
                    </div>
                  </div>
                </div>

                {canEdit && (
                  <DialogFooter>
                    <Button variant="outline" onClick={() => handleEditEmployee(selectedEmployee)}>
                      Düzenle
                    </Button>
                  </DialogFooter>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Çalışan Düzenle" : "Yeni Çalışan Ekle"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Çalışan bilgilerini güncelleyin" : "Yeni çalışan bilgilerini doldurun"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" name="name" value={newEmployee.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Pozisyon</Label>
                  <Select
                    value={newEmployee.position}
                    onValueChange={(value: string) => handleSelectChange("position", value)}
                  >
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Pozisyon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departman</Label>
                  <Select
                    value={newEmployee.department}
                    onValueChange={(value: string) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Departman seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" name="phone" value={newEmployee.phone} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Profil Resmi URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={newEmployee.image}
                    onChange={handleInputChange}
                    placeholder="/placeholder.svg?height=300&width=300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Hakkında</Label>
                <textarea
                  id="description"
                  name="description"
                  value={newEmployee.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Çalışan hakkında kısa bir açıklama..."
                />
               </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">{isEditing ? "Güncelle" : "Ekle"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}


"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Search, ArrowUpDown, ChevronDown, Edit, Save, X } from "lucide-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useAdminMode } from "@/hooks/use-admin-mode"

// Basit bir orta boy avatar bileşeni oluşturalım (shadcn/ui Avatar çalışmıyorsa)
function SimpleAvatar({ name, image, className = "" }: { name: string; image?: string; className?: string }) {
  // İsmin baş harflerini al
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-medium ${className}`}
    >
      {initials}
    </div>
  )
}

// Aktivite tipi
type Activity = {
  id: number
  user: {
    name: string
    image: string
    department: string
  }
  action: string
  status: "Online" | "Away" | "Offline"
  time: string
  duration: string
}

// Örnek aktivite verileri
const activitiesData: Activity[] = [
  {
    id: 1,
    user: {
      name: "Ahmet Yılmaz",
      image: "/placeholder.svg?height=32&width=32",
      department: "Teknoloji",
    },
    action: "Kod geliştirme",
    status: "Online",
    time: "10:30",
    duration: "2 saat 15 dakika",
  },
  {
    id: 2,
    user: {
      name: "Ayşe Demir",
      image: "/placeholder.svg?height=32&width=32",
      department: "Tasarım",
    },
    action: "Arayüz tasarımı",
    status: "Online",
    time: "09:45",
    duration: "3 saat 30 dakika",
  },
  {
    id: 3,
    user: {
      name: "Mehmet Kaya",
      image: "/placeholder.svg?height=32&width=32",
      department: "Yönetim",
    },
    action: "Toplantı",
    status: "Away",
    time: "11:00",
    duration: "1 saat",
  },
  {
    id: 4,
    user: {
      name: "Zeynep Şahin",
      image: "/placeholder.svg?height=32&width=32",
      department: "Veri",
    },
    action: "Veri analizi",
    status: "Online",
    time: "10:15",
    duration: "2 saat 45 dakika",
  },
  {
    id: 5,
    user: {
      name: "Ali Öztürk",
      image: "/placeholder.svg?height=32&width=32",
      department: "Teknoloji",
    },
    action: "Mobil uygulama geliştirme",
    status: "Offline",
    time: "08:30",
    duration: "0 saat",
  },
  {
    id: 6,
    user: {
      name: "Fatma Yıldız",
      image: "/placeholder.svg?height=32&width=32",
      department: "İK",
    },
    action: "İşe alım görüşmesi",
    status: "Away",
    time: "14:00",
    duration: "45 dakika",
  },
  {
    id: 7,
    user: {
      name: "Mustafa Çelik",
      image: "/placeholder.svg?height=32&width=32",
      department: "Pazarlama",
    },
    action: "Kampanya planlaması",
    status: "Online",
    time: "11:30",
    duration: "1 saat 30 dakika",
  },
  {
    id: 8,
    user: {
      name: "Elif Aydın",
      image: "/placeholder.svg?height=32&width=32",
      department: "Satış",
    },
    action: "Müşteri görüşmesi",
    status: "Online",
    time: "13:15",
    duration: "1 saat 15 dakika",
  },
  {
    id: 9,
    user: {
      name: "Hasan Kara",
      image: "/placeholder.svg?height=32&width=32",
      department: "Teknoloji",
    },
    action: "Hata düzeltme",
    status: "Online",
    time: "10:45",
    duration: "2 saat",
  },
  {
    id: 10,
    user: {
      name: "Seda Arslan",
      image: "/placeholder.svg?height=32&width=32",
      department: "Tasarım",
    },
    action: "Logo tasarımı",
    status: "Away",
    time: "09:30",
    duration: "3 saat",
  },
]

export default function RealtimePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [activities, setActivities] = useState<Activity[]>(activitiesData)
  const [editingCell, setEditingCell] = useState<{ rowId: number; column: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminError, setAdminError] = useState("")
  const pendingEditRef = useRef<{ rowId: number; column: string; value: string } | null>(null)

  // Avatar bileşeninin çalışıp çalışmadığını kontrol etmek için state
  const [useCustomAvatar, setUseCustomAvatar] = useState(true)

  const { isAdminMode } = useAdminMode()

  const handleEditClick = (rowId: number, column: string, currentValue: string) => {
    if (isAdminMode) {
      // Admin modunda doğrudan düzenlemeye başla
      setEditingCell({ rowId, column })
      setEditValue(currentValue)
    } else {
      // Admin modunda değilse doğrulama iste
      pendingEditRef.current = { rowId, column, value: currentValue }
      setAdminDialogOpen(true)
      setAdminPassword("")
      setAdminError("")
    }
  }

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Admin şifresi kontrolü (fake)
    if (adminPassword === "admin123") {
      // Şifre doğru, düzenlemeye izin ver
      setAdminDialogOpen(false)
      setAdminError("")

      if (pendingEditRef.current) {
        const { rowId, column, value } = pendingEditRef.current
        setEditingCell({ rowId, column })
        setEditValue(value)
        pendingEditRef.current = null
      }
    } else {
      // Şifre yanlış
      setAdminError("Yanlış şifre. Lütfen tekrar deneyin.")
    }
  }

  const handleSaveEdit = (rowId: number, column: string) => {
    // Değişiklikleri kaydet
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === rowId) {
          if (column === "action") {
            return { ...activity, action: editValue }
          } else if (column === "status") {
            return { ...activity, status: editValue as "Online" | "Away" | "Offline" }
          } else if (column === "time") {
            return { ...activity, time: editValue }
          } else if (column === "duration") {
            return { ...activity, duration: editValue }
          }
        }
        return activity
      }),
    )

    // Düzenleme modunu kapat
    setEditingCell(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  // Avatar bileşenini değiştirme butonu
  const toggleAvatarComponent = () => {
    setUseCustomAvatar((prev) => !prev)
  }

  // Tablo sütunları
  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: "user",
      header: "Çalışan",
      cell: ({ row }) => {
        const user = row.getValue("user") as Activity["user"]
        return (
          <div className="flex items-center gap-3">
            {useCustomAvatar ? (
              <SimpleAvatar name={user.name} image={user.image} />
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage src="invalid-image-url" alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.department}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "action",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Aktivite
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const action = row.getValue("action") as string
        const rowId = row.original.id

        if (editingCell && editingCell.rowId === rowId && editingCell.column === "action") {
          return (
            <div className="flex items-center gap-2">
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-8 py-1" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(rowId, "action")}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        }

        return (
          <div className="flex items-center justify-between">
            <span>{action}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleEditClick(rowId, "action", action)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const rowId = row.original.id

        if (editingCell && editingCell.rowId === rowId && editingCell.column === "status") {
          return (
            <div className="flex items-center gap-2">
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 rounded-md border border-input px-3 py-1 text-sm"
                aria-label="Durum seçin"
              >
                <option value="Online">Online</option>
                <option value="Away">Away</option>
                <option value="Offline">Offline</option>
              </select>
              <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(rowId, "status")}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        }

        return (
          <div className="flex items-center justify-between">
            <Badge
              className={status === "Online" ? "bg-green-500" : status === "Away" ? "bg-yellow-500" : "bg-gray-500"}
            >
              {status}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleEditClick(rowId, "status", status)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "time",
      header: "Başlangıç Saati",
      cell: ({ row }) => {
        const time = row.getValue("time") as string
        const rowId = row.original.id

        if (editingCell && editingCell.rowId === rowId && editingCell.column === "time") {
          return (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 py-1"
                placeholder="HH:MM"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(rowId, "time")}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        }

        return (
          <div className="flex items-center justify-between">
            <span>{time || "---"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleEditClick(rowId, "time", time || "")}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Süre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const duration = row.getValue("duration") as string
        const rowId = row.original.id

        if (editingCell && editingCell.rowId === rowId && editingCell.column === "duration") {
          return (
            <div className="flex items-center gap-2">
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="h-8 py-1" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(rowId, "duration")}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        }

        return (
          <div className="flex items-center justify-between">
            <span>{duration || "---"}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleEditClick(rowId, "duration", duration || "")}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: activities,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Gerçek Zamanlı Aktivite</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Çalışan ara..."
                className="pl-8"
                value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("user")?.setFilterValue(event.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Durum <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Online"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Online")}
                >
                  Online
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Away"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Away")}
                >
                  Away
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getColumn("status")?.getFilterValue() === "Offline"}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue("Offline")}
                >
                  Offline
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={!table.getColumn("status")?.getFilterValue()}
                  onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
                >
                  Tümü
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Avatar bileşenini değiştirme butonu */}
        <div className="mb-4">
          
        
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Sonuç bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sonraki
          </Button>
        </div>
      </div>
      {/* Admin Şifresi Modalı */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Doğrulama</DialogTitle>
            <DialogDescription>Değişiklik yapmak için admin şifresini girin</DialogDescription>
          </DialogHeader>

          {adminError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{adminError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="adminPassword" className="text-sm font-medium">
                Admin Şifresi
              </label>
              <Input
                id="adminPassword"
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">(Fake: Şifre "admin123")</p>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="button" variant="outline" onClick={() => setAdminDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">Doğrula</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}


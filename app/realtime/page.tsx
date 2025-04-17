"use client"

import { useState, useEffect } from "react"
import { Search, ArrowUpDown, ChevronDown, Wifi, WifiOff } from "lucide-react"
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
import { Edit, Save, X } from "lucide-react"
import type { AktifUygulama, AktiflikDurumu } from "@/lib/types"
import { useAktifUygulamalar } from "@/lib/socket-client"

interface RealtimePageProps {
  initialAktifUygulamalar?: AktifUygulama[]
  initialAktiflikDurumu?: AktiflikDurumu[]
}

// Etkinlik süresi tipi
type EtkinlikSuresi = {
  id: number
  username: string
  date: string
  toplamSure: number
  formattedSure: string
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
  date: string
  userId: number // Durum güncellemesi için kullanılacak
}

export default function RealtimePage({ initialAktifUygulamalar, initialAktiflikDurumu }: RealtimePageProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [editingCell, setEditingCell] = useState<{ rowId: number; column: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [etkinlikSuresi, setEtkinlikSuresi] = useState<EtkinlikSuresi[]>([])

  // WebSocket üzerinden aktif uygulamaları ve durumları dinle
  const { aktifUygulamalar, aktiflikDurumu, isConnected, updateDurum } = useAktifUygulamalar(
    initialAktifUygulamalar,
    initialAktiflikDurumu,
  )

  // Etkinlik sürelerini API'den al
  useEffect(() => {
    const fetchEtkinlikSuresi = async () => {
      try {
        const response = await fetch("/api/etkinlik-suresi")
        if (response.ok) {
          const data = await response.json()
          setEtkinlikSuresi(data)
        }
      } catch (error) {
        console.error("Etkinlik süresi alınamadı:", error)
      }
    }

    fetchEtkinlikSuresi()

    // Her 5 saniyede bir etkinlik sürelerini güncelle
    const intervalId = setInterval(fetchEtkinlikSuresi, 5000)

    return () => clearInterval(intervalId)
  }, [])

  // Avatar bileşeninin çalışıp çalışmadığını kontrol etmek için state
  const [useCustomAvatar, setUseCustomAvatar] = useState(true)

  // Mock hooks for development
  const useAdminModeMock = () => ({ isAdminMode: true })
  const useAuthMock = () => ({ isAdmin: true })

  const { isAdminMode } = useAdminModeMock()
  const { isAdmin } = useAuthMock()

  // Admin yetkisi kontrolü
  const canEdit = isAdmin && isAdminMode

  // Veritabanından gelen verileri aktivite formatına dönüştür
  useEffect(() => {
    console.log("Veriler değişti:", {
      aktifUygulamalar: aktifUygulamalar?.length,
      aktiflikDurumu: aktiflikDurumu?.length,
      etkinlikSuresi: etkinlikSuresi?.length,
    })

    if (aktifUygulamalar && aktifUygulamalar.length > 0) {
      // Aktif uygulamaları, durumları ve etkinlik sürelerini birleştir
      const mappedActivities = aktifUygulamalar.map((item) => {
        // Kullanıcının durumunu bul
        const durumBilgisi = aktiflikDurumu?.find((durum) => durum.username === item.username) || {
          durum: "Offline",
        }

        // Kullanıcının etkinlik süresini bul
        const sureBilgisi = etkinlikSuresi?.find((sure) => sure.username === item.username)

        return {
          id: item.id,
          userId: item.userId,
          user: {
            name: item.username || "Bilinmeyen Kullanıcı",
            image: "/placeholder.svg?height=32&width=32",
            department: "Kullanıcı",
          },
          action: item.aktifUygulama || "Bilinmeyen Uygulama",
          status: (durumBilgisi.durum as "Online" | "Away" | "Offline") || "Offline",
          time: sureBilgisi?.formattedSure || "00:00",
          date: item.date ? new Date(item.date).toLocaleDateString() : "Bilinmiyor",
        }
      })

      setActivities(mappedActivities)
    }
  }, [aktifUygulamalar, aktiflikDurumu, etkinlikSuresi])

  const handleEditClick = (rowId: number, column: string, currentValue: string) => {
    if (canEdit) {
      // Admin modunda doğrudan düzenlemeye başla
      setEditingCell({ rowId, column })
      setEditValue(currentValue)
    }
  }

  const handleSaveEdit = async (rowId: number, column: string) => {
    // Değişiklikleri kaydet
    if (column === "status") {
      // Durum değişikliğini veritabanına kaydet
      const activity = activities.find((a) => a.id === rowId)
      if (activity) {
        // Durum güncellemesini API'ye gönder
        const success = await updateDurum(activity.id, editValue)
        if (!success) {
          console.error("Durum güncellenemedi")
          return
        }
      }
    }

    // UI'ı güncelle
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === rowId) {
          if (column === "action") {
            return { ...activity, action: editValue }
          } else if (column === "status") {
            return { ...activity, status: editValue as "Online" | "Away" | "Offline" }
          } else if (column === "time") {
            return { ...activity, time: editValue }
          }
        }
        return activity
      }),
    )

    setEditingCell(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const toggleAvatarComponent = () => {
    setUseCustomAvatar((prev) => !prev)
  }

  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: "user",
      header: "Çalışan",
      cell: ({ row }) => {
        const user = row.getValue("user") as Activity["user"]
        return (
          <div className="flex items-center gap-3">
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
            Aktif Uygulama
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
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => handleEditClick(rowId, "action", action)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
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
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => handleEditClick(rowId, "status", status)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "time",
      header: "Toplam Süre",
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
            <span className="font-medium">{time || "00:00"}</span>
            {canEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => handleEditClick(rowId, "time", time || "")}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tarih
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("date") as string
        return <div>{date}</div>
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Gerçek Zamanlı Aktivite</h1>
            {isConnected ? (
              <Badge className="bg-green-500 ml-2">
                <Wifi className="h-3 w-3 mr-1" /> Bağlı
              </Badge>
            ) : (
              <Badge className="bg-red-500 ml-2">
                <WifiOff className="h-3 w-3 mr-1" /> Bağlantı Yok
              </Badge>
            )}
          </div>
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
          <Button onClick={toggleAvatarComponent} variant="outline">
            {useCustomAvatar ? "Shadcn Avatar Kullan" : "Özel Avatar Kullan"}
          </Button>
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
    </DashboardLayout>
  )
}

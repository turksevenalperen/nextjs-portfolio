"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Clock,
  LayoutDashboard,
  Menu,
  Search,
  Users,
  Briefcase,
  Activity,
  UserRound,
  Bell,
  X,
  Lock,
  LockOpen,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminMode } from "@/hooks/use-admin-mode"
import { signOut } from "next-auth/react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const { isAdminMode, toggleAdminMode, adminDialogOpen, setAdminDialogOpen } = useAdminMode()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Çalışanlar",
      icon: Users,
      href: "/employees",
      active: pathname === "/employees",
    },
    {
      label: "Projeler",
      icon: Briefcase,
      href: "/projects",
      active: pathname === "/projects",
    },
    {
      label: "Gerçek Zamanlı",
      icon: Activity,
      href: "/realtime",
      active: pathname === "/realtime",
    },
    {
      label: "Takımlar",
      icon: BarChart3,
      href: "/teams",
      active: pathname === "/teams",
    },
    {
      label: "Zaman Takibi",
      icon: Clock,
      href: "/time",
      active: pathname === "/time",
    },
  ]

  const SidebarContent = (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg">IOTECH</span>
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Ara..." className="pl-8" />
          </div>
        </div>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
            <AvatarFallback>AY</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium">Alperen Türkseven</span>
            <span className="text-xs text-muted-foreground">Stajer</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleAdminMode} // Burada toggleAdminMode kullanıyoruz
            title={isAdminMode ? "Admin Modunu Kapat" : "Admin Moduna Geç"}
          >
            {isAdminMode ? (
              <LockOpen className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
            {isAdminMode && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
            <span className="sr-only">{isAdminMode ? "Admin Modu Aktif (Kapatmak için tıklayın)" : "Admin Modu"}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Yeni çalışan eklendi</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Proje tamamlandı</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Toplantı hatırlatması</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">
                  <span>Ayarlar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdminMode && (
                <>
                  <DropdownMenuItem onClick={() => toggleAdminMode()}>
                    <span>Admin Modundan Çık</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}>
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobil Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden absolute left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menüyü Aç</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          {SidebarContent}
        </SheetContent>
      </Sheet>

      {/* Masaüstü Sidebar */}
      <aside className={cn("hidden border-r bg-background lg:block", className)}>{SidebarContent}</aside>
    </>
  )
}


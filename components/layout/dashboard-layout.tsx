"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DashboardLayout({ className, children }: DashboardLayoutProps) {
  return (
    <div className={cn("flex h-screen antialiased", className)}>
      <div className="flex-none w-64 border-r bg-muted/10">
       <Sidebar/>
        <div className="p-4 font-medium">Dashboard</div>
      </div>
      <main className="flex-1 h-full p-4 overflow-auto">{children}</main>
    </div>
  )
}

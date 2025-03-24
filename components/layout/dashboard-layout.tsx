"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DashboardLayout({ className, children }: DashboardLayoutProps) {
  return (
    <div className={cn("flex h-screen antialiased", className)}>
      <Sidebar className="flex-none w-64 border-r" />
      <main className="flex-1 h-full p-4">{children}</main>
    </div>
  )
}


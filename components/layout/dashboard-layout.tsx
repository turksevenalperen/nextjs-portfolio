import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto p-4 sm:p-6">{children}</div>
      </main>
    </div>
  )
}


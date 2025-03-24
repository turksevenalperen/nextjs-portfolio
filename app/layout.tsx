
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminModeProvider } from "@/hooks/use-admin-mode"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IOTECH Çalışan Yönetim Sistemi",
  description: "IOTECH şirketi için çalışan yönetim sistemi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AdminModeProvider>
            <SessionProvider>{children}</SessionProvider>
          </AdminModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

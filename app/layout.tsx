import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AdminModeProvider } from "@/hooks/use-admin-mode"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IOTECH Çalışan Yönetim Sistemi",
  description: "IOTECH şirketi için çalışan yönetim sistemi",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AdminModeProvider>{children}</AdminModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


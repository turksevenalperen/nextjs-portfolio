"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { Durum } from "@/lib/types/durum"

interface DurumTableProps {
  durumlar: Durum[]
}

export function DurumTable({ durumlar }: DurumTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter data based on search term
  const filteredData = durumlar.filter(
    (item) =>
      item.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.AppName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Kullanıcı veya uygulama ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kullanıcı</TableHead>
              <TableHead>Uygulama</TableHead>
              <TableHead>Süre (dk)</TableHead>
              <TableHead>Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.Username}</TableCell>
                  <TableCell>{item.AppName}</TableCell>
                  <TableCell>{item.Duration}</TableCell>
                  <TableCell>{new Date(item.Date).toLocaleString("tr-TR")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Veri bulunamadı."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

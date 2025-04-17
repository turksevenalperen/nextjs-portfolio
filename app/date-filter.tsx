"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface DateFilterProps {
  onFilterChange: (startDate: Date | undefined, endDate: Date | undefined) => void
}

export function DateFilter({ onFilterChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    onFilterChange(date, endDate)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    onFilterChange(startDate, date)
  }

  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    onFilterChange(undefined, undefined)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP", { locale: tr }) : "Başlangıç Tarihi"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} initialFocus />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP", { locale: tr }) : "Bitiş Tarihi"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
            disabled={(date) => (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>

      <Button variant="ghost" onClick={clearFilters}>
        Filtreleri Temizle
      </Button>
    </div>
  )
}

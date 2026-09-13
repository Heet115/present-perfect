"use client"

import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

export interface DatePickerProps {
  value?: string // YYYY-MM-DD
  onChange?: (date: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  required?: boolean
  minDate?: string
  maxDate?: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDateToIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return ""
  const d = parseDate(dateStr)
  if (!d) return dateStr
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  id,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // View year and month state in the calendar grid
  const initialDate = parseDate(value) || new Date()
  const [viewYear, setViewYear] = React.useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(initialDate.getMonth())

  // Keep view in sync when value changes externally
  React.useEffect(() => {
    if (value) {
      const d = parseDate(value)
      if (d) {
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      }
    }
  }, [value])

  const today = new Date()
  const todayIso = formatDateToIso(today)

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day)
    const iso = formatDateToIso(selected)
    onChange?.(iso)
    setOpen(false)
  }

  const handleSelectToday = () => {
    onChange?.(todayIso)
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.("")
  }

  // Calculate calendar grid days
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  // Generate Year Selector options (from 100 years ago to 20 years in the future)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 120 }, (_, i) => currentYear - 90 + i)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        id={id}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background/60 px-3 py-2 text-xs transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          !value && "text-muted-foreground",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground p-0.5 rounded-full transition-colors cursor-pointer"
            aria-label="Clear date"
          >
            <X className="size-3" />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[280px] p-3 select-none"
        sideOffset={6}
      >
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="h-7 w-7 p-0 rounded-lg cursor-pointer hover:bg-accent"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-foreground">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="h-7 w-7 p-0 rounded-lg cursor-pointer hover:bg-accent"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-medium text-muted-foreground">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Previous month filler days */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1
            return (
              <div
                key={`prev-${i}`}
                className="h-7 w-7 flex items-center justify-center text-muted-foreground/30 text-[11px]"
              >
                {dayNum}
              </div>
            )
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayDate = new Date(viewYear, viewMonth, day)
            const iso = formatDateToIso(dayDate)
            const isSelected = value === iso
            const isToday = todayIso === iso
            const isDisabled = Boolean(
              (minDate && iso < minDate) || (maxDate && iso > maxDate)
            )

            return (
              <button
                key={day}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectDay(day)}
                className={cn(
                  "h-7 w-7 flex items-center justify-center rounded-lg text-xs transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                    : isToday
                    ? "border border-primary text-primary font-semibold hover:bg-primary/10"
                    : "hover:bg-accent hover:text-accent-foreground text-foreground",
                  isDisabled && "opacity-25 cursor-not-allowed pointer-events-none"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-border/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectToday}
            className="h-6 text-[11px] px-2 text-primary hover:text-primary cursor-pointer hover:bg-primary/10 rounded-md"
          >
            Today
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange?.("")
                setOpen(false)
              }}
              className="h-6 text-[11px] px-2 text-muted-foreground hover:text-destructive cursor-pointer hover:bg-destructive/10 rounded-md"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

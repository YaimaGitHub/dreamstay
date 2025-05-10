"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"
import { useTranslation } from "react-i18next"
import type { Room } from "@/types/room"
import { isDateAvailable } from "@/utils/date-utils"

interface DateSelectionButtonsProps {
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
  calendarOpen: "arrival" | "departure" | null
  room: Room
  setCalendarOpen: (value: "arrival" | "departure" | null) => void
  handleSelect: (date: Date | undefined) => void
}

export function DateSelectionButtons({
  selectedRange,
  calendarOpen,
  room,
  setCalendarOpen,
  handleSelect,
}: DateSelectionButtonsProps) {
  const { t } = useTranslation()
  const today = new Date()

  const disabledDays = {
    before: today,
    matchDate: (date: Date) => !isDateAvailable(date, room.bookedDates),
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Popover open={calendarOpen === "arrival"} onOpenChange={(open) => open && setCalendarOpen("arrival")}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedRange.from && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange.from ? (
              format(selectedRange.from, "d 'de' MMMM, yyyy", { locale: es })
            ) : (
              <span>{t("calendar.arrival")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedRange.from}
            onSelect={handleSelect}
            disabled={disabledDays}
            locale={es}
            className="rounded-md border bg-white p-2 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Popover open={calendarOpen === "departure"} onOpenChange={(open) => open && setCalendarOpen("departure")}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !selectedRange.to && "text-muted-foreground")}
            disabled={!selectedRange.from}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange.to ? (
              format(selectedRange.to, "d 'de' MMMM, yyyy", { locale: es })
            ) : (
              <span>{t("calendar.departure")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedRange.to}
            onSelect={handleSelect}
            disabled={{
              ...disabledDays,
              before: selectedRange.from || today,
            }}
            locale={es}
            className="rounded-md border bg-white p-2 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

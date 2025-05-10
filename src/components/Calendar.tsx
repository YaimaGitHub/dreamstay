"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { Room } from "@/types/room"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTranslation } from "react-i18next"
import { DateSelectionButtons } from "./calendar/DateSelectionButtons"
import { CalendarLegend } from "./calendar/CalendarLegend"
import { GuestInputs } from "./calendar/GuestInputs"
import { StaySummary } from "./calendar/StaySummary"
import { AvailabilityStatus } from "./calendar/AvailabilityStatus"
import { useAvailabilityCalendar } from "@/hooks/use-availability-calendar"
import { useEffect, useRef } from "react"

interface AvailabilityCalendarProps {
  room: Room
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onAvailabilityVerified?: (isAvailable: boolean) => void
}

export function AvailabilityCalendar({
  room,
  selectedRange,
  onRangeChange,
  onAvailabilityVerified,
}: AvailabilityCalendarProps) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const calendarRef = useRef<HTMLDivElement>(null)

  const {
    adults,
    children,
    babies,
    setAdults,
    setChildren,
    setBabies,
    isAvailable,
    calendarOpen,
    setCalendarOpen,
    isVerifying,
    handleSelect,
    verifyAvailability,
    totalNights,
    totalPrice,
  } = useAvailabilityCalendar({
    room,
    selectedRange,
    onRangeChange,
    onAvailabilityVerified,
  })

  // Scroll to calendar when opened on mobile
  useEffect(() => {
    if (calendarOpen && isMobile && calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [calendarOpen, isMobile])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      verifyAvailability()
    }
  }

  return (
    <div className="booking-calendar space-y-4" ref={calendarRef}>
      {/* Date selection with popovers */}
      <DateSelectionButtons
        selectedRange={selectedRange}
        calendarOpen={calendarOpen}
        room={room}
        setCalendarOpen={setCalendarOpen}
        handleSelect={handleSelect}
      />

      <CalendarLegend />

      <div className="space-y-4">
        <GuestInputs
          adults={adults}
          children={children}
          babies={babies}
          setAdults={setAdults}
          setChildren={setChildren}
          setBabies={setBabies}
        />

        <Button
          onClick={verifyAvailability}
          className="w-full"
          disabled={isVerifying || !selectedRange.from || !selectedRange.to}
          onKeyDown={handleKeyDown}
          aria-live="polite"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("calendar.verifying")}
            </span>
          ) : (
            t("calendar.checkAvailability")
          )}
        </Button>

        {selectedRange.from && selectedRange.to && (
          <StaySummary selectedRange={selectedRange} totalNights={totalNights} totalPrice={totalPrice} />
        )}

        <AvailabilityStatus isAvailable={isAvailable} />
      </div>
    </div>
  )
}

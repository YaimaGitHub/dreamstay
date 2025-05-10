"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Room } from "@/types/room"
import { useToast } from "@/hooks/use-toast"
import { areAllDatesAvailable } from "@/utils/date-utils"
import { useTranslation } from "react-i18next"

interface UseAvailabilityCalendarProps {
  room: Room
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onAvailabilityVerified?: (isAvailable: boolean) => void
}

export function useAvailabilityCalendar({
  room,
  selectedRange,
  onRangeChange,
  onAvailabilityVerified,
}: UseAvailabilityCalendarProps) {
  const { t } = useTranslation()
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [babies, setBabies] = useState(0)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [calendarOpen, setCalendarOpen] = useState<"arrival" | "departure" | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  // Memoize total guests calculation
  const totalGuests = useMemo(() => adults + children, [adults, children])

  // Memoize total nights calculation
  const totalNights = useMemo(() => {
    if (!selectedRange.from || !selectedRange.to) return 0
    return Math.round((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24))
  }, [selectedRange.from, selectedRange.to])

  // Memoize total price calculation
  const totalPrice = useMemo(() => totalNights * room.price, [totalNights, room.price])

  // Effect for updating external availability state
  useEffect(() => {
    if (isAvailable !== null && onAvailabilityVerified) {
      onAvailabilityVerified(isAvailable)
    }
  }, [isAvailable, onAvailabilityVerified])

  // Memoized handler for date selection
  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (calendarOpen === "arrival") {
        onRangeChange({ from: date, to: selectedRange.to })
        setCalendarOpen("departure")
      } else if (calendarOpen === "departure") {
        onRangeChange({ from: selectedRange.from, to: date })
        setCalendarOpen(null)
        // Reset availability state when dates change
        setIsAvailable(null)
        if (onAvailabilityVerified) {
          onAvailabilityVerified(false)
        }
      }
    },
    [calendarOpen, selectedRange, onRangeChange, onAvailabilityVerified],
  )

  // Memoized verification function
  const verifyAvailability = useCallback(() => {
    if (!selectedRange.from || !selectedRange.to) {
      toast({
        title: t("booking.error"),
        description: t("booking.selectDatesError"),
        variant: "destructive",
      })
      return
    }

    // Validate date range
    if (selectedRange.from > selectedRange.to) {
      toast({
        title: t("booking.error"),
        description: t("booking.invalidDateRange"),
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    // Simulate a verification with a small delay
    setTimeout(() => {
      try {
        if (totalGuests > room.capacity) {
          toast({
            title: t("booking.notAvailable"),
            description: t("roomDetail.guestsExceedCapacity"),
            variant: "destructive",
          })
          setIsAvailable(false)
          if (onAvailabilityVerified) {
            onAvailabilityVerified(false)
          }
          setIsVerifying(false)
          return
        }

        const datesAvailable = areAllDatesAvailable(selectedRange.from!, selectedRange.to!, room.bookedDates)

        setIsAvailable(datesAvailable)

        if (datesAvailable) {
          toast({
            title: t("roomDetail.available"),
            description: t("roomDetail.roomAvailableForDates", { roomName: room.name }),
            variant: "default",
          })
        } else {
          toast({
            title: t("booking.notAvailable"),
            description: t("roomDetail.roomNotAvailable"),
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error verifying availability:", error)
        toast({
          title: t("booking.error"),
          description: t("booking.errorVerifyingAvailability"),
          variant: "destructive",
        })
        setIsAvailable(false)
      } finally {
        setIsVerifying(false)
      }
    }, 800)
  }, [selectedRange, totalGuests, room, toast, t, onAvailabilityVerified])

  return {
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
  }
}

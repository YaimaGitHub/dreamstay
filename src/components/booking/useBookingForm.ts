"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Room } from "@/types/room"
import { useToast } from "@/hooks/use-toast"
import { bookingSchema, type BookingFormValues } from "./bookingSchema"
import { sendWhatsAppMessage } from "./WhatsAppService"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

interface UseBookingFormProps {
  room: Room
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function useBookingForm({ room, selectedRange }: UseBookingFormProps) {
  const { t } = useTranslation()
  const { formatPrice, currency } = useCurrency()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [nightsCount, setNightsCount] = useState(0)
  const { toast } = useToast()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      age: undefined,
      gender: undefined,
      email: "",
      phone: "",
      arrivalDate: selectedRange.from || new Date(),
      needsPickup: false,
      flightNumber: "",
      comments: "",
      adults: 1,
      children: 0,
      babies: 0,
      paymentMethod: "cash",
    },
    mode: "onChange", // Validate on change for better user experience
  })

  // Memoize the watch function to prevent unnecessary re-renders
  const paymentMethod = form.watch("paymentMethod")
  const needsPickup = form.watch("needsPickup")

  // Reset flight number when pickup is not needed
  useEffect(() => {
    if (!needsPickup) {
      form.setValue("flightNumber", "")
    }
  }, [needsPickup, form])

  // Calculate total price when form values or selected range changes
  useEffect(() => {
    if (selectedRange.from && selectedRange.to) {
      const nights = Math.round((selectedRange.to.getTime() - selectedRange.from.getTime()) / (1000 * 60 * 60 * 24))
      setNightsCount(nights)

      const basePrice = nights * room.price
      const surcharge = paymentMethod === "transfer" ? basePrice * 0.15 : 0

      setTotalPrice(basePrice + surcharge)
    }
  }, [selectedRange, paymentMethod, room.price])

  // Memoize the submit handler to prevent unnecessary re-renders
  const onSubmit = useCallback(
    async (data: BookingFormValues) => {
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

      // Validate total guests against room capacity
      const totalGuests = data.adults + data.children
      if (totalGuests > room.capacity) {
        toast({
          title: t("booking.error"),
          description: t("roomDetail.guestsExceedCapacity"),
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      try {
        // WhatsApp number to send the request
        const phoneNumber = "123456789" // Replace with the real WhatsApp number

        // Send WhatsApp message
        await sendWhatsAppMessage(phoneNumber, {
          room,
          formData: data,
          checkIn: selectedRange.from!,
          checkOut: selectedRange.to!,
          nightsCount,
          totalPrice,
          currency,
        })

        toast({
          title: t("booking.success"),
          description: t("booking.successMessage"),
        })

        // Reset form after successful submission
        form.reset({
          fullName: "",
          age: undefined,
          gender: undefined,
          email: "",
          phone: "",
          arrivalDate: selectedRange.from,
          needsPickup: false,
          flightNumber: "",
          comments: "",
          adults: 1,
          children: 0,
          babies: 0,
          paymentMethod: "cash",
        })
      } catch (error) {
        console.error("Error submitting booking form:", error)
        toast({
          title: t("booking.error"),
          description: t("booking.errorMessage"),
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [selectedRange, room, nightsCount, totalPrice, currency, toast, t, form],
  )

  return {
    form,
    isSubmitting,
    nightsCount,
    totalPrice,
    onSubmit,
  }
}

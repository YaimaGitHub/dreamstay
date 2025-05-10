"use client"

import type { Room } from "@/types/room"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { PersonalInfoFields } from "./booking/PersonalInfoFields"
import { GuestFields } from "./booking/GuestFields"
import { PaymentMethodFields } from "./booking/PaymentMethodFields"
import { TravelDetailsFields } from "./booking/TravelDetailsFields"
import { PriceSummary } from "./booking/PriceSummary"
import { useBookingForm } from "./booking/useBookingForm"
import { useTranslation } from "react-i18next"

interface BookingFormProps {
  room: Room
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function BookingForm({ room, selectedRange }: BookingFormProps) {
  const { t } = useTranslation()
  const { form, isSubmitting, nightsCount, totalPrice, onSubmit } = useBookingForm({
    room,
    selectedRange,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <PersonalInfoFields control={form.control} />
          <GuestFields control={form.control} />
          <PaymentMethodFields control={form.control} />

          {selectedRange.from && selectedRange.to && (
            <PriceSummary room={room} nightsCount={nightsCount} totalPrice={totalPrice} />
          )}

          <TravelDetailsFields control={form.control} />
        </div>

        <Button type="submit" className="w-full bg-rental-terra hover:bg-rental-accent" disabled={isSubmitting}>
          {isSubmitting ? t("booking.submitting") : t("booking.submit")}
        </Button>
      </form>
    </Form>
  )
}

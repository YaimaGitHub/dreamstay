"use client"

import type { Room } from "@/types/room"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilityCalendar } from "../Calendar"
import { BookingForm } from "../BookingForm"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"
import { Lock } from "lucide-react"

interface BookingCardProps {
  room: Room
}

export function BookingCard({ room }: BookingCardProps) {
  const { t } = useTranslation()
  const { formatPriceWithIcon } = useCurrency()
  const [activeTab, setActiveTab] = useState<string>("calendar")
  const [bookingEnabled, setBookingEnabled] = useState(false)

  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Función para manejar la disponibilidad verificada
  const handleAvailabilityVerified = (isAvailable: boolean) => {
    setBookingEnabled(isAvailable)
    // Si no hay disponibilidad y estamos en la pestaña de reserva, volver a la pestaña de calendario
    if (!isAvailable && activeTab === "booking") {
      setActiveTab("calendar")
    }
  }

  const handleTabChange = (value: string) => {
    // Solo permitir cambiar a la pestaña de reserva si está habilitada
    if (value === "booking" && !bookingEnabled) {
      return
    }
    setActiveTab(value)
  }

  return (
    <Card className="p-6 sticky top-24 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-rental-terra flex items-center animate-fade-in">
          {formatPriceWithIcon(room.price)}
        </span>
        <span className="text-muted-foreground animate-fade-in">{t("roomDetail.perNight")}</span>
      </div>

      <h3 className="text-md mb-2">{t("roomDetail.addDates")}</h3>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="calendar" className="transition-all duration-200 hover:bg-muted/80">
            {t("roomDetail.add")}
          </TabsTrigger>
          <TabsTrigger
            value="booking"
            disabled={!bookingEnabled}
            className="relative transition-all duration-200 hover:bg-muted/80"
          >
            {!bookingEnabled && <Lock className="h-4 w-4 absolute left-3 animate-pulse" />}
            {t("roomDetail.booking")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 animate-fade-in">
          <AvailabilityCalendar
            room={room}
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            onAvailabilityVerified={handleAvailabilityVerified}
          />
        </TabsContent>

        <TabsContent value="booking" className="animate-fade-in">
          <BookingForm room={room} selectedRange={selectedRange} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

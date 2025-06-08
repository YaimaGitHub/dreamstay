"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronDown, Clock, Globe, MapPin } from "lucide-react"
import type { DateRange } from "react-day-picker"
import AdditionalServices, { sampleServices } from "@/components/AdditionalServices"
import ReservationForm from "@/components/ReservationForm"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { Room } from "@/types/room"
import PricingBreakdownDetailed from "@/components/PricingBreakdownDetailed"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import GuestSelector from "@/components/GuestSelector"

interface BookingFormProps {
  roomId: number
  price: number
  room: Room
}

export interface SelectedService {
  id: number
  title: string
  price: number
}

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

type TourismOption = {
  id: string
  label: string
  type: "national" | "international"
  mode: "nightly" | "hourly"
  price: number
  icon: React.ReactNode
}

const BookingForm = ({ roomId, price, room }: BookingFormProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 2,
    children: 0,
    babies: 0,
    pets: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null)
  const [showAvailabilityMessage, setShowAvailabilityMessage] = useState(false)
  const [selectedTourismOption, setSelectedTourismOption] = useState<string>("")
  const [hours, setHours] = useState("24")
  const [isMobile, setIsMobile] = useState(false)

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Obtener opciones de turismo disponibles
  const getTourismOptions = (): TourismOption[] => {
    const options: TourismOption[] = []

    if (
      room.pricing?.internationalTourism?.enabled &&
      room.pricing.internationalTourism.nightlyRate?.enabled &&
      room.pricing.internationalTourism.nightlyRate.price > 0
    ) {
      options.push({
        id: "international-nightly",
        label: "Turismo Internacional - Por Noche",
        type: "international",
        mode: "nightly",
        price: room.pricing.internationalTourism.nightlyRate.price,
        icon: <Globe className="h-4 w-4" />,
      })
    }

    if (
      room.pricing?.nationalTourism?.enabled &&
      room.pricing.nationalTourism.nightlyRate?.enabled &&
      room.pricing.nationalTourism.nightlyRate.price > 0
    ) {
      options.push({
        id: "national-nightly",
        label: "Turismo Nacional - Por Noche",
        type: "national",
        mode: "nightly",
        price: room.pricing.nationalTourism.nightlyRate.price,
        icon: <MapPin className="h-4 w-4" />,
      })
    }

    if (
      room.pricing?.nationalTourism?.enabled &&
      room.pricing.nationalTourism.hourlyRate?.enabled &&
      room.pricing.nationalTourism.hourlyRate.price > 0
    ) {
      options.push({
        id: "national-hourly",
        label: "Turismo Nacional - Por Hora",
        type: "national",
        mode: "hourly",
        price: room.pricing.nationalTourism.hourlyRate.price,
        icon: <Clock className="h-4 w-4" />,
      })
    }

    return options
  }

  const tourismOptions = getTourismOptions()
  const selectedOption = tourismOptions.find((opt) => opt.id === selectedTourismOption)

  const getStayDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    const diffTime = dateRange.to.getTime() - dateRange.from.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const duration = getStayDuration()

  const checkDateAvailability = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) {
      setIsDateAvailable(null)
      return
    }

    const reservedDates = room.reservedDates || []
    const isOverlapping = reservedDates.some((reservedRange) => {
      const reservedStart = new Date(reservedRange.start)
      const reservedEnd = new Date(reservedRange.end)

      return (
        (range.from <= reservedEnd && range.from >= reservedStart) ||
        (range.to <= reservedEnd && range.to >= reservedStart) ||
        (range.from <= reservedStart && range.to >= reservedEnd)
      )
    })

    setIsDateAvailable(!isOverlapping)
    setShowAvailabilityMessage(true)

    setTimeout(() => {
      setShowAvailabilityMessage(false)
    }, 5000)
  }

  const getRoomTotalPrice = () => {
    if (!selectedOption) return 0

    if (selectedOption.mode === "nightly") {
      return selectedOption.price * duration
    } else {
      return selectedOption.price * Number.parseInt(hours)
    }
  }

  const roomTotalPrice = getRoomTotalPrice()
  const servicesTotalPrice = selectedServices.reduce((total, service) => total + service.price, 0)
  const totalPrice = roomTotalPrice + servicesTotalPrice + 40

  const handleServiceToggle = (serviceId: number, isSelected: boolean) => {
    const service = sampleServices.find((s) => s.id === serviceId)

    if (service) {
      if (isSelected) {
        setSelectedServices((prev) => [
          ...prev,
          {
            id: service.id,
            title: service.title,
            price: service.price,
          },
        ])
      } else {
        setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId))
      }
    }
  }

  const handleBooking = () => {
    if (!room.hostWhatsApp?.enabled) {
      toast.error("Esta habitación no tiene WhatsApp configurado para reservas")
      return
    }

    const canSendToPrimary = room.hostWhatsApp.sendToPrimary && room.hostWhatsApp.primary
    const canSendToSecondary = room.hostWhatsApp.sendToSecondary && room.hostWhatsApp.secondary

    if (!canSendToPrimary && !canSendToSecondary) {
      toast.error("No hay números de WhatsApp configurados para recibir reservas")
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowReservationForm(true)
    }, 1000)
  }

  const closeReservationForm = () => {
    setShowReservationForm(false)
  }

  return (
    <div className="bg-white rounded-lg border border-border p-4 sm:p-6 sticky top-24">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center">
          <div className="flex items-center text-sm">
            <span className="text-terracotta">★★★★★</span>
            <span className="ml-1 font-medium">{room.rating}</span>
          </div>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{room.reviews} reseñas</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Selector de tipo de turismo mejorado y responsivo */}
        {tourismOptions.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Tipo de Turismo</label>
            <Select value={selectedTourismOption} onValueChange={setSelectedTourismOption}>
              <SelectTrigger
                className={`w-full border-border transition-all duration-200 hover:border-terracotta/50 focus:border-terracotta ${isMobile ? "h-14 text-base" : "h-12 text-sm"}`}
              >
                <SelectValue placeholder={isMobile ? "Seleccionar turismo" : "Seleccionar tipo de turismo"} />
              </SelectTrigger>
              <SelectContent
                className={`
                  ${isMobile ? "w-[calc(100vw-2rem)] max-w-none" : "w-full min-w-[400px]"}
                  max-h-[60vh] overflow-y-auto
                `}
                side={isMobile ? "bottom" : "bottom"}
                align={isMobile ? "center" : "start"}
                sideOffset={isMobile ? 8 : 4}
                avoidCollisions={true}
                collisionPadding={isMobile ? 16 : 8}
              >
                {tourismOptions.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className={`
                      ${isMobile ? "py-4 px-3" : "py-3 px-2"} 
                      cursor-pointer hover:bg-terracotta/5 focus:bg-terracotta/10
                      transition-colors duration-200
                    `}
                  >
                    <div className={`flex items-center justify-between w-full ${isMobile ? "gap-3" : "gap-2"}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`flex-shrink-0 ${isMobile ? "p-2" : "p-1.5"} rounded-full bg-terracotta/10`}>
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-foreground ${isMobile ? "text-base" : "text-sm"} truncate`}>
                            {isMobile
                              ? // Versión móvil más compacta
                                option.type === "international"
                                ? "Internacional"
                                : "Nacional"
                              : option.label}
                          </div>
                          <div className={`text-muted-foreground ${isMobile ? "text-sm" : "text-xs"} truncate`}>
                            {option.mode === "nightly" ? "Por noche" : "Por hora"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`
                          flex-shrink-0 font-semibold
                          ${isMobile ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5"}
                          bg-terracotta/10 text-terracotta border-terracotta/20
                        `}
                      >
                        ${option.price}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Información del tipo seleccionado mejorada */}
            {selectedOption && (
              <div
                className={`p-4 bg-gradient-to-r from-terracotta/5 to-orange/5 rounded-lg border border-terracotta/20 transition-all duration-300 ${isMobile ? "space-y-3" : "space-y-2"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex-shrink-0 ${isMobile ? "p-2.5" : "p-2"} rounded-full bg-terracotta/15`}>
                      {selectedOption.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-foreground ${isMobile ? "text-lg" : "text-base"} truncate`}>
                        {isMobile
                          ? selectedOption.type === "international"
                            ? "Turismo Internacional"
                            : "Turismo Nacional"
                          : selectedOption.label}
                      </div>
                      <div className={`text-muted-foreground ${isMobile ? "text-base" : "text-sm"}`}>
                        {selectedOption.mode === "nightly" ? "Tarifa por noche" : "Tarifa por hora"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Badge
                      variant="default"
                      className={`
                        font-bold bg-terracotta hover:bg-terracotta/90
                        ${isMobile ? "text-base px-4 py-2" : "text-sm px-3 py-1"}
                      `}
                    >
                      ${selectedOption.price}
                    </Badge>
                    <div className={`text-muted-foreground mt-1 ${isMobile ? "text-sm" : "text-xs"}`}>
                      / {selectedOption.mode === "nightly" ? "noche" : "hora"}
                    </div>
                  </div>
                </div>

                {/* Información adicional en móviles */}
                {isMobile && (
                  <div className="pt-2 border-t border-terracotta/10">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 bg-terracotta rounded-full"></div>
                      <span>Precio seleccionado para tu reserva</span>
                      <div className="h-1.5 w-1.5 bg-terracotta rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Fechas</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-between border-border ${isMobile ? "h-12" : "h-11"} py-3`}
              >
                <div className="flex items-center">
                  <CalendarIcon className={`mr-2 ${isMobile ? "h-5 w-5" : "h-4 w-4"}`} />
                  <div className="text-left">
                    {dateRange?.from && dateRange?.to ? (
                      <div>
                        <div className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}>
                          {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                          {format(dateRange.to, "d MMM", { locale: es })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {duration} noche{duration !== 1 ? "s" : ""}
                        </div>
                      </div>
                    ) : (
                      <span className={isMobile ? "text-base" : "text-sm"}>Seleccionar fechas</span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`opacity-50 ${isMobile ? "h-5 w-5" : "h-4 w-4"}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    checkDateAvailability(range)
                  }
                }}
                numberOfMonths={isMobile ? 1 : 2}
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Selector de horas si está en modo por hora */}
        {selectedOption?.mode === "hourly" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Número de horas</label>
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger className={`w-full border-border ${isMobile ? "h-12" : "h-11"}`}>
                <SelectValue placeholder="Seleccionar horas" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour} hora{hour > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selector de huéspedes mejorado */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Huéspedes</label>
          <GuestSelector
            value={guests}
            onChange={setGuests}
            maxGuests={room.capacity || 10}
            className="w-full"
            variant={isMobile ? "mobile" : "default"}
          />
        </div>

        <div className="mt-6">
          <AdditionalServices services={sampleServices} onServiceToggle={handleServiceToggle} />
        </div>

        {showAvailabilityMessage && dateRange?.from && dateRange?.to && (
          <div
            className={`mt-4 p-3 rounded-lg transition-all duration-500 transform ${
              isDateAvailable
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            } ${showAvailabilityMessage ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="flex items-center">
              {isDateAvailable ? (
                <>
                  <div className="mr-2 flex-shrink-0 rounded-full p-1 bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}>
                    ¡Habitación disponible para las fechas seleccionadas!
                  </p>
                </>
              ) : (
                <>
                  <div className="mr-2 flex-shrink-0 rounded-full p-1 bg-red-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className={`font-medium ${isMobile ? "text-base" : "text-sm"}`}>
                    Lo sentimos, la habitación no está disponible para las fechas seleccionadas.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
          <DialogTrigger asChild>
            <Button
              className={`w-full bg-terracotta hover:bg-terracotta/90 mt-6 font-medium ${
                isMobile ? "h-12 text-base" : "h-12 text-base"
              }`}
              onClick={handleBooking}
              disabled={
                isProcessing ||
                !selectedTourismOption ||
                !dateRange?.from ||
                !dateRange?.to ||
                isDateAvailable === false
              }
            >
              {isProcessing ? (
                "Verificando disponibilidad..."
              ) : !selectedTourismOption ? (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Seleccione tipo de turismo
                </span>
              ) : !dateRange?.from || !dateRange?.to ? (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Seleccione fechas
                </span>
              ) : isDateAvailable === false ? (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No disponible
                </span>
              ) : (
                "Reservar ahora"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0">
            <ReservationForm
              room={room}
              dateRange={dateRange}
              guests={guests}
              selectedServices={selectedServices}
              onClose={closeReservationForm}
              duration={duration}
              roomPrice={selectedOption?.price || room.price}
              pricingMode={selectedOption?.mode || "nightly"}
              hours={selectedOption?.mode === "hourly" ? Number.parseInt(hours) : undefined}
              selectedTourismType={selectedOption?.type}
              onDateRangeChange={setDateRange}
            />
          </DialogContent>
        </Dialog>

        <p className="text-center text-sm text-muted-foreground">No se te cobrará nada todavía</p>
      </div>

      {/* Desglose de precios */}
      {selectedOption && (
        <div className="mt-6">
          <PricingBreakdownDetailed
            room={room}
            selectedTourismType={selectedOption.type}
            pricingMode={selectedOption.mode}
            nights={duration}
            hours={Number.parseInt(hours)}
            selectedServices={selectedServices}
            showAllOptions={false}
          />
        </div>
      )}
    </div>
  )
}

export default BookingForm

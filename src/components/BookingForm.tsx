"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import AdditionalServices, { sampleServices } from "@/components/AdditionalServices"
import ReservationForm from "@/components/ReservationForm"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { Room } from "@/types/room"

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

const BookingForm = ({ roomId, price, room }: BookingFormProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [guests, setGuests] = useState("2")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [isDateAvailable, setIsDateAvailable] = useState<boolean | null>(null)
  const [showAvailabilityMessage, setShowAvailabilityMessage] = useState(false)

  // Calcular la duración de la estancia en días
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

    // Get the reserved dates from the room data
    const reservedDates = room.reservedDates || []

    // Check if selected dates overlap with any reserved dates
    const isOverlapping = reservedDates.some((reservedRange) => {
      const reservedStart = new Date(reservedRange.start)
      const reservedEnd = new Date(reservedRange.end)

      // Check for overlap
      return (
        (range.from <= reservedEnd && range.from >= reservedStart) ||
        (range.to <= reservedEnd && range.to >= reservedStart) ||
        (range.from <= reservedStart && range.to >= reservedEnd)
      )
    })

    // Set availability status (true if NOT overlapping with reserved dates)
    setIsDateAvailable(!isOverlapping)
    setShowAvailabilityMessage(true)

    // Hide message after 5 seconds
    setTimeout(() => {
      setShowAvailabilityMessage(false)
    }, 5000)
  }

  // Calcular el precio total de la habitación
  const roomTotalPrice = price * duration

  // Calcular el precio total de los servicios adicionales
  const servicesTotalPrice = selectedServices.reduce((total, service) => total + service.price, 0)

  // Calcular el precio total (habitación + servicios)
  const totalPrice = roomTotalPrice + servicesTotalPrice + 40 // 40 = tarifas fijas (limpieza + servicio)

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
    setIsProcessing(true)

    // Verificar disponibilidad (simulado)
    setTimeout(() => {
      setIsProcessing(false)
      setShowReservationForm(true)
    }, 1000)
  }

  const closeReservationForm = () => {
    setShowReservationForm(false)
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-muted-foreground ml-1">/ noche</span>
        </div>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium">Fechas</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-border">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                      {format(dateRange.to, "d MMM", { locale: es })}
                    </>
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
                numberOfMonths={2}
                locale={es}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Huéspedes</label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="w-full border-border">
              <SelectValue placeholder="Número de huéspedes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Huésped</SelectItem>
              <SelectItem value="2">2 Huéspedes</SelectItem>
              <SelectItem value="3">3 Huéspedes</SelectItem>
              <SelectItem value="4">4 Huéspedes</SelectItem>
            </SelectContent>
          </Select>
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
                  <p className="text-sm font-medium">¡Habitación disponible para las fechas seleccionadas!</p>
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
                  <p className="text-sm font-medium">
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
              className="w-full bg-terracotta hover:bg-terracotta/90 mt-6"
              onClick={handleBooking}
              disabled={isProcessing || !dateRange?.from || !dateRange?.to || isDateAvailable === false}
            >
              {isProcessing ? (
                "Verificando disponibilidad..."
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <ReservationForm
              room={room}
              dateRange={dateRange}
              guests={Number.parseInt(guests)}
              selectedServices={selectedServices}
              onClose={closeReservationForm}
              duration={duration}
              roomPrice={price}
            />
          </DialogContent>
        </Dialog>

        <p className="text-center text-sm text-muted-foreground">No se te cobrará nada todavía</p>
      </div>

      <div className="border-t border-border mt-6 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>
            ${price} x {duration} noches
          </span>
          <span>${roomTotalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de limpieza</span>
          <span>$25</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de servicio</span>
          <span>$15</span>
        </div>

        {selectedServices.length > 0 && (
          <>
            <div className="pt-2 border-t border-border">
              <h4 className="font-medium mb-2">Servicios adicionales:</h4>
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.title}</span>
                  <span>${service.price}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between font-bold border-t border-border pt-4 mt-4">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

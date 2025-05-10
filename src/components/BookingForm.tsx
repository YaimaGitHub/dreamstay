"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface BookingFormProps {
  roomId: number
  price: number
}

const BookingForm = ({ roomId, price }: BookingFormProps) => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  })
  const [guests, setGuests] = useState("2")
  const [isProcessing, setIsProcessing] = useState(false)

  // Calcular la duración de la estancia en días
  const getStayDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    const diffTime = dateRange.to.getTime() - dateRange.from.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const duration = getStayDuration()

  // Calcular el precio total
  const totalPrice = price * duration

  const handleBooking = () => {
    setIsProcessing(true)
    // Aquí iría la lógica para procesar la reserva
    setTimeout(() => {
      setIsProcessing(false)
      // Redireccionar a una página de confirmación
      navigate("/confirmacion")
    }, 1500)
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
            <span className="ml-1 font-medium">4.9</span>
          </div>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">124 reseñas</span>
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
                onSelect={setDateRange}
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

        <Button className="w-full bg-terracotta hover:bg-terracotta/90" onClick={handleBooking} disabled={isProcessing}>
          {isProcessing ? "Procesando..." : "Reservar ahora"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">No se te cobrará nada todavía</p>
      </div>

      <div className="border-t border-border mt-6 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>
            ${price} x {duration} noches
          </span>
          <span>${price * duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de limpieza</span>
          <span>$25</span>
        </div>
        <div className="flex justify-between">
          <span>Tarifa de servicio</span>
          <span>$15</span>
        </div>
        <div className="flex justify-between font-bold border-t border-border pt-4 mt-4">
          <span>Total</span>
          <span>${totalPrice + 40}</span>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

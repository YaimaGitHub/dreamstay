"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { cubanProvinces } from "@/data/provinces"
import { useDataStore } from "@/hooks/use-data-store"
import GuestSelector from "@/components/GuestSelector"

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

const SearchForm = () => {
  const navigate = useNavigate()
  const { rooms } = useDataStore()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  })
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    babies: 0,
    pets: 0,
  })
  const [province, setProvince] = useState("")
  const [availableRooms, setAvailableRooms] = useState<number[]>([])

  // Verificar disponibilidad de habitaciones cuando cambian las fechas o la provincia
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Filtrar habitaciones disponibles según fechas y provincia
      const available = rooms
        .filter((room) => {
          // Verificar si la habitación está disponible (no deshabilitada)
          if (room.available === false) return false

          // Verificar si la habitación está en la provincia seleccionada (si hay una seleccionada)
          if (province && room.province !== province) return false

          // Si la habitación no tiene fechas reservadas, está disponible
          if (!room.reservedDates || room.reservedDates.length === 0) return true

          // Verificar si las fechas seleccionadas se superponen con alguna reserva
          const selectedStart = dateRange.from.getTime()
          const selectedEnd = dateRange.to.getTime()

          // La habitación está disponible si ninguna de sus fechas reservadas se superpone
          return !room.reservedDates.some((reservation) => {
            const reservationStart = new Date(reservation.start).getTime()
            const reservationEnd = new Date(reservation.end).getTime()

            // Verificar superposición de fechas
            return (
              (selectedStart >= reservationStart && selectedStart <= reservationEnd) || // Inicio dentro de reserva
              (selectedEnd >= reservationStart && selectedEnd <= reservationEnd) || // Fin dentro de reserva
              (selectedStart <= reservationStart && selectedEnd >= reservationEnd) // Reserva dentro del rango
            )
          })
        })
        .map((room) => room.id)

      setAvailableRooms(available)
    }
  }, [dateRange, province, rooms])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Construir parámetros de búsqueda
    const params = new URLSearchParams()

    if (province) {
      params.append("province", province)
    }

    if (dateRange?.from) {
      params.append("from", dateRange.from.toISOString())
    }

    if (dateRange?.to) {
      params.append("to", dateRange.to.toISOString())
    }

    // Enviar información detallada de huéspedes
    params.append("adults", guests.adults.toString())
    params.append("children", guests.children.toString())
    params.append("babies", guests.babies.toString())
    params.append("pets", guests.pets.toString())

    // Navegar a la página de resultados con los parámetros
    navigate(`/habitaciones?${params.toString()}`)
  }

  const getTotalGuests = () => {
    return guests.adults + guests.children + guests.babies
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4 md:p-6 grid gap-4 md:flex md:items-end">
      <div className="space-y-2 flex-1">
        <label htmlFor="location" className="block text-sm font-medium">
          Destino
        </label>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger id="location" className="border-muted h-11">
            <SelectValue placeholder="Seleccione provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {cubanProvinces.map((prov) => (
              <SelectItem key={prov} value={prov}>
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex-1">
        <label className="block text-sm font-medium">Fechas</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal w-full border-muted h-11">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from && dateRange?.to ? (
                <>
                  {format(dateRange.from, "d MMM", { locale: es })} - {format(dateRange.to, "d MMM", { locale: es })}
                </>
              ) : (
                <span>Seleccionar fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={window.innerWidth < 768 ? 1 : 2}
              locale={es}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="guests" className="block text-sm font-medium">
          Huéspedes
        </label>
        <GuestSelector
          value={guests}
          onChange={setGuests}
          maxGuests={10}
          className="w-full md:w-[200px]"
          placeholder="¿Cuántos?"
        />
      </div>

      <Button className="bg-terracotta hover:bg-terracotta/90 mt-4 md:mt-0 h-11" size="lg">
        <Search className="mr-2 h-4 w-4" />
        Buscar
      </Button>

      {availableRooms.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2 md:mt-0 md:ml-2">
          {availableRooms.length} habitaciones disponibles
        </div>
      )}
    </form>
  )
}

export default SearchForm

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

  // Verificar disponibilidad de habitaciones
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const available = rooms
        .filter((room) => {
          if (room.available === false) return false
          if (province && room.province !== province) return false
          if (!room.reservedDates || room.reservedDates.length === 0) return true

          const selectedStart = dateRange.from.getTime()
          const selectedEnd = dateRange.to.getTime()

          return !room.reservedDates.some((reservation) => {
            const reservationStart = new Date(reservation.start).getTime()
            const reservationEnd = new Date(reservation.end).getTime()

            return (
              (selectedStart >= reservationStart && selectedStart <= reservationEnd) ||
              (selectedEnd >= reservationStart && selectedEnd <= reservationEnd) ||
              (selectedStart <= reservationStart && selectedEnd >= reservationEnd)
            )
          })
        })
        .map((room) => room.id)

      setAvailableRooms(available)
    }
  }, [dateRange, province, rooms])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

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

    params.append("adults", guests.adults.toString())
    params.append("children", guests.children.toString())
    params.append("babies", guests.babies.toString())
    params.append("pets", guests.pets.toString())

    navigate(`/habitaciones?${params.toString()}`)
  }

  if (isMobile) {
    // Layout móvil - vertical
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium">
            Destino
          </label>
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger id="location" className="border-muted h-12 text-base">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium">Fechas</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal w-full border-muted h-12">
                <CalendarIcon className="mr-2 h-5 w-5" />
                <span className="text-base">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      {format(dateRange.from, "d MMM", { locale: es })} -{" "}
                      {format(dateRange.to, "d MMM", { locale: es })}
                    </>
                  ) : (
                    "Seleccionar fechas"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
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
            className="w-full"
            placeholder="¿Cuántos?"
            variant="mobile"
          />
        </div>

        <Button className="bg-terracotta hover:bg-terracotta/90 w-full h-12 text-base font-medium" size="lg">
          <Search className="mr-2 h-5 w-5" />
          Buscar
        </Button>

        {availableRooms.length > 0 && (
          <div className="text-sm text-muted-foreground text-center">
            {availableRooms.length} habitaciones disponibles
          </div>
        )}
      </form>
    )
  }

  // Layout desktop/tablet - horizontal
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
              numberOfMonths={2}
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
          variant="default"
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

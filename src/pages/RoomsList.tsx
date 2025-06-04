"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import RoomGrid from "@/components/rooms/RoomGrid"
import RoomFilters from "@/components/rooms/RoomFilters"
import { useDataStore } from "@/hooks/use-data-store"
import type { Room } from "@/types/room"

interface GuestCounts {
  adults: number
  children: number
  babies: number
  pets: number
}

const RoomsList = () => {
  const [searchParams] = useSearchParams()
  const { rooms } = useDataStore()
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])

  // Obtener parámetros de búsqueda de la URL
  const searchFilters = useMemo(() => {
    const province = searchParams.get("province")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    // Obtener información detallada de huéspedes
    const adults = Number.parseInt(searchParams.get("adults") || "1")
    const children = Number.parseInt(searchParams.get("children") || "0")
    const babies = Number.parseInt(searchParams.get("babies") || "0")
    const pets = Number.parseInt(searchParams.get("pets") || "0")

    const guests: GuestCounts = { adults, children, babies, pets }
    const totalGuests = adults + children + babies

    return {
      province: province && province !== "all" ? province : null,
      dateRange:
        from && to
          ? {
              from: new Date(from),
              to: new Date(to),
            }
          : null,
      guests,
      totalGuests,
    }
  }, [searchParams])

  // Filtrar habitaciones según los criterios de búsqueda
  useEffect(() => {
    let filtered = [...rooms]

    // Filtrar por provincia
    if (searchFilters.province) {
      filtered = filtered.filter((room) => room.province === searchFilters.province)
    }

    // Filtrar por capacidad (total de huéspedes sin contar mascotas)
    if (searchFilters.totalGuests > 0) {
      filtered = filtered.filter((room) => (room.capacity || 4) >= searchFilters.totalGuests)
    }

    // Filtrar por disponibilidad de fechas
    if (searchFilters.dateRange) {
      const { from, to } = searchFilters.dateRange
      filtered = filtered.filter((room) => {
        // Si la habitación no está disponible, excluirla
        if (room.available === false) return false

        // Si no tiene fechas reservadas, está disponible
        if (!room.reservedDates || room.reservedDates.length === 0) return true

        // Verificar si las fechas seleccionadas se superponen con alguna reserva
        const selectedStart = from.getTime()
        const selectedEnd = to.getTime()

        return !room.reservedDates.some((reservation) => {
          const reservationStart = new Date(reservation.start).getTime()
          const reservationEnd = new Date(reservation.end).getTime()

          // Verificar superposición de fechas
          return (
            (selectedStart >= reservationStart && selectedStart <= reservationEnd) ||
            (selectedEnd >= reservationStart && selectedEnd <= reservationEnd) ||
            (selectedStart <= reservationStart && selectedEnd >= reservationEnd)
          )
        })
      })
    }

    setFilteredRooms(filtered)
  }, [rooms, searchFilters])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Habitaciones Disponibles</h1>

          {/* Mostrar información de la búsqueda */}
          <div className="text-muted-foreground mb-4">
            {searchFilters.province && <span>en {searchFilters.province} </span>}
            {searchFilters.dateRange && (
              <span>
                del {searchFilters.dateRange.from.toLocaleDateString()} al{" "}
                {searchFilters.dateRange.to.toLocaleDateString()}
              </span>
            )}
            {searchFilters.totalGuests > 0 && (
              <span>
                {" "}
                para {searchFilters.totalGuests} huésped{searchFilters.totalGuests !== 1 ? "es" : ""}
                {searchFilters.guests.pets > 0 &&
                  ` + ${searchFilters.guests.pets} mascota${searchFilters.guests.pets !== 1 ? "s" : ""}`}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">
            {filteredRooms.length} habitación{filteredRooms.length !== 1 ? "es" : ""} encontrada
            {filteredRooms.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <RoomFilters
              rooms={filteredRooms}
              onFiltersChange={setFilteredRooms}
              initialGuests={searchFilters.guests}
            />
          </div>
          <div className="lg:col-span-3">
            <RoomGrid
              rooms={filteredRooms}
              searchParams={{
                dateRange: searchFilters.dateRange,
                guests: searchFilters.guests,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsList

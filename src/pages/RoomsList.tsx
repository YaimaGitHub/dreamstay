"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import RoomGrid from "@/components/rooms/RoomGrid"
import RoomFilters from "@/components/rooms/RoomFilters"
import { useDataStore } from "@/hooks/use-data-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Sparkles, ArrowLeft, Home } from "lucide-react"

const RoomsList = () => {
  const [searchParams] = useSearchParams()
  const { rooms } = useDataStore()

  // Estados para filtros
  const [priceRange, setPriceRange] = useState<number[]>([0, 500])
  const [roomType, setRoomType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("available")
  const [isLoading, setIsLoading] = useState(true)
  const [showSearchInfo, setShowSearchInfo] = useState(false)

  // Calcular rango de precios dinámico basado en las habitaciones reales
  const priceStats = useMemo(() => {
    if (rooms.length === 0) return { min: 0, max: 500, avg: 100 }

    const prices = rooms
      .map((room) => {
        // Obtener el precio más bajo disponible de la habitación
        let minPrice = room.price || 0

        if (room.pricing) {
          const nationalNightly = room.pricing.nationalTourism?.nightlyRate?.enabled
            ? room.pricing.nationalTourism.nightlyRate.price
            : 0
          const nationalHourly = room.pricing.nationalTourism?.hourlyRate?.enabled
            ? room.pricing.nationalTourism.hourlyRate.price
            : 0
          const internationalNightly = room.pricing.internationalTourism?.nightlyRate?.enabled
            ? room.pricing.internationalTourism.nightlyRate.price
            : 0

          const availablePrices = [nationalNightly, nationalHourly, internationalNightly, minPrice].filter(
            (price) => price > 0,
          )

          if (availablePrices.length > 0) {
            minPrice = Math.min(...availablePrices)
          }
        }

        return minPrice
      })
      .filter((price) => price > 0)

    if (prices.length === 0) return { min: 0, max: 500, avg: 100 }

    return {
      min: Math.floor(Math.min(...prices) / 10) * 10,
      max: Math.ceil(Math.max(...prices) / 10) * 10,
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }
  }, [rooms])

  // Inicializar rango de precios cuando se cargan las habitaciones
  useEffect(() => {
    if (rooms.length > 0 && priceRange[0] === 0 && priceRange[1] === 500) {
      setPriceRange([priceStats.min, priceStats.max])
    }
    setIsLoading(false)
  }, [rooms, priceStats])

  // Obtener parámetros de búsqueda de la URL
  const searchFilters = useMemo(() => {
    const province = searchParams.get("province")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const adults = Number.parseInt(searchParams.get("adults") || "1")
    const children = Number.parseInt(searchParams.get("children") || "0")
    const babies = Number.parseInt(searchParams.get("babies") || "0")
    const pets = Number.parseInt(searchParams.get("pets") || "0")

    const totalGuests = adults + children + babies

    const hasSearchParams = province || from || to || totalGuests > 1

    return {
      province: province && province !== "all" ? province : null,
      dateRange:
        from && to
          ? {
              from: new Date(from),
              to: new Date(to),
            }
          : null,
      totalGuests,
      guests: { adults, children, babies, pets },
      hasSearchParams,
    }
  }, [searchParams])

  // Mostrar información de búsqueda con delay
  useEffect(() => {
    if (searchFilters.hasSearchParams) {
      const timer = setTimeout(() => setShowSearchInfo(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowSearchInfo(false)
    }
  }, [searchFilters.hasSearchParams])

  // Filtrar habitaciones con lógica mejorada
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms]

    // Filtrar por disponibilidad
    if (availabilityFilter === "available") {
      filtered = filtered.filter((room) => room.available !== false)
    } else if (availabilityFilter === "unavailable") {
      filtered = filtered.filter((room) => room.available === false)
    }

    // Filtrar por provincia de URL
    if (searchFilters.province) {
      filtered = filtered.filter((room) => room.province === searchFilters.province)
    }

    // Filtrar por capacidad de URL
    if (searchFilters.totalGuests > 0) {
      filtered = filtered.filter((room) => (room.capacity || 4) >= searchFilters.totalGuests)
    }

    // Filtrar por fechas de URL
    if (searchFilters.dateRange) {
      const { from, to } = searchFilters.dateRange
      filtered = filtered.filter((room) => {
        if (room.available === false) return false
        if (!room.reservedDates || room.reservedDates.length === 0) return true

        const selectedStart = from.getTime()
        const selectedEnd = to.getTime()

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
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por rango de precio (mejorado)
    filtered = filtered.filter((room) => {
      let roomMinPrice = room.price || 0

      if (room.pricing) {
        const nationalNightly = room.pricing.nationalTourism?.nightlyRate?.enabled
          ? room.pricing.nationalTourism.nightlyRate.price
          : 0
        const nationalHourly = room.pricing.nationalTourism?.hourlyRate?.enabled
          ? room.pricing.nationalTourism.hourlyRate.price
          : 0
        const internationalNightly = room.pricing.internationalTourism?.nightlyRate?.enabled
          ? room.pricing.internationalTourism.nightlyRate.price
          : 0

        const availablePrices = [nationalNightly, nationalHourly, internationalNightly, roomMinPrice].filter(
          (price) => price > 0,
        )

        if (availablePrices.length > 0) {
          roomMinPrice = Math.min(...availablePrices)
        }
      }

      return roomMinPrice >= priceRange[0] && roomMinPrice <= priceRange[1]
    })

    // Filtrar por tipo de habitación
    if (roomType !== "all") {
      filtered = filtered.filter((room) => room.type === roomType)
    }

    return filtered
  }, [rooms, searchFilters, searchTerm, priceRange, roomType, availabilityFilter])

  const availableCount = rooms.filter((room) => room.available !== false).length
  const unavailableCount = rooms.filter((room) => room.available === false).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Navegación de regreso */}
        <div className="mb-6 animate-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="hover:bg-orange-50 hover:border-orange-200">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Regresar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hover:bg-orange-50">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Inicio</span> / <span className="font-medium">Habitaciones</span>
            </div>
          </div>
        </div>

        {/* Header animado */}
        <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg animate-pulse">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Habitaciones Disponibles
            </h1>
          </div>

          {/* Información de búsqueda con animación */}
          {showSearchInfo && (
            <div className="mb-6 animate-in slide-in-from-top-2 duration-500">
              <Card className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 border-muted backdrop-blur-sm">
                <div className="flex flex-wrap gap-3 items-center">
                  {searchFilters.province && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-500/10 text-orange-600 border-orange-500/20 animate-in zoom-in-50 duration-300"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {searchFilters.province}
                    </Badge>
                  )}
                  {searchFilters.dateRange && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/10 text-blue-600 border-blue-500/20 animate-in zoom-in-50 duration-300 delay-100"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {searchFilters.dateRange.from.toLocaleDateString()} -{" "}
                      {searchFilters.dateRange.to.toLocaleDateString()}
                    </Badge>
                  )}
                  {searchFilters.totalGuests > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600 border-green-500/20 animate-in zoom-in-50 duration-300 delay-200"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {searchFilters.totalGuests} huésped{searchFilters.totalGuests !== 1 ? "es" : ""}
                      {searchFilters.guests.pets > 0 &&
                        ` + ${searchFilters.guests.pets} mascota${searchFilters.guests.pets !== 1 ? "s" : ""}`}
                    </Badge>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Estadísticas con animación */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in zoom-in-50 duration-500">
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
              <div className="text-sm text-green-700">Disponibles</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in zoom-in-50 duration-500 delay-100">
              <div className="text-2xl font-bold text-red-600">{unavailableCount}</div>
              <div className="text-sm text-red-700">No disponibles</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in zoom-in-50 duration-500 delay-200">
              <div className="text-2xl font-bold text-blue-600">{filteredRooms.length}</div>
              <div className="text-sm text-blue-700">Filtradas</div>
            </Card>
            <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in zoom-in-50 duration-500 delay-300">
              <div className="text-2xl font-bold text-purple-600">${priceStats.avg}</div>
              <div className="text-sm text-purple-700">Precio promedio</div>
            </Card>
          </div>
        </div>

        {/* Filtros */}
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <RoomFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            roomType={roomType}
            setRoomType={setRoomType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            priceStats={priceStats}
          />
        </div>

        {/* Grid de habitaciones */}
        <div className="animate-in fade-in duration-700 delay-400">
          <RoomGrid rooms={filteredRooms} />
        </div>
      </div>
    </div>
  )
}

export default RoomsList

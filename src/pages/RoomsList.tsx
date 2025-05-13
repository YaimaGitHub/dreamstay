"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bed, Wifi, Coffee, Star, SlidersHorizontal, MapPin } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { cubanProvinces } from "@/data/provinces"

const RoomsList = () => {
  const location = useLocation()
  const { rooms } = useDataStore()
  const [priceRange, setPriceRange] = useState<number[]>([50, 200])
  const [roomType, setRoomType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [selectedProvince, setSelectedProvince] = useState<string>("")

  // Agregar esta línea para definir el estilo de animación personalizado
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.9; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }
  `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Parse URL parameters for search
  useEffect(() => {
    const params = new URLSearchParams(location.search)

    // Set province from URL if available
    const provinceParam = params.get("province")
    if (provinceParam) {
      setSelectedProvince(provinceParam)
    }

    // Set date range from URL if available
    const fromParam = params.get("from")
    const toParam = params.get("to")

    // Set guests from URL if available
    const guestsParam = params.get("guests")

    // Show filters if any search parameters are present
    if (provinceParam || fromParam || toParam || guestsParam) {
      setShowFilters(true)
    }
  }, [location.search])

  // Filtrar habitaciones
  const filteredRooms = rooms.filter((room) => {
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
    const matchesType = roomType === "all" || room.type === roomType
    const matchesSearch =
      searchTerm === "" ||
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())
    const isAvailable = room.available !== false // Consider undefined as available

    // Filter by province if selected
    const matchesProvince = selectedProvince === "" || room.province === selectedProvince

    // Filter by URL parameters for dates if present
    const params = new URLSearchParams(location.search)
    const fromParam = params.get("from")
    const toParam = params.get("to")

    let matchesDates = true
    if (fromParam && toParam && room.reservedDates && room.reservedDates.length > 0) {
      const searchStart = new Date(fromParam).getTime()
      const searchEnd = new Date(toParam).getTime()

      // Check if any reserved dates overlap with search dates
      matchesDates = !room.reservedDates.some((reservation) => {
        const reservationStart = new Date(reservation.start).getTime()
        const reservationEnd = new Date(reservation.end).getTime()

        return (
          (searchStart >= reservationStart && searchStart <= reservationEnd) || // Start within reservation
          (searchEnd >= reservationStart && searchEnd <= reservationEnd) || // End within reservation
          (searchStart <= reservationStart && searchEnd >= reservationEnd) // Reservation within search range
        )
      })
    }

    return matchesPrice && matchesType && matchesSearch && isAvailable && matchesProvince && matchesDates
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Nuestras Habitaciones</h1>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Buscar habitaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-64"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-terracotta text-terracotta"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Precio por noche</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={(value) => setPriceRange(value)}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de habitación</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Familiar">Familiar</SelectItem>
                    <SelectItem value="Económica">Económica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Provincia</label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {cubanProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Servicios</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="wifi" />
                    <label htmlFor="wifi" className="ml-2 text-sm">
                      WiFi gratis
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="breakfast" />
                    <label htmlFor="breakfast" className="ml-2 text-sm">
                      Desayuno incluido
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="bathroom" />
                    <label htmlFor="bathroom" className="ml-2 text-sm">
                      Baño privado
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden card-hover border border-border/50">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                {room.province && (
                  <div className="absolute top-3 right-3 z-10">
                    <div
                      className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-lg 
                 animate-pulse-slow hover:scale-105 transition-all duration-300 
                 border border-white/20 flex items-center"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-terracotta mr-2 animate-ping"></span>
                      {room.province}
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{room.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {room.location}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 fill-accent-foreground mr-1" /> {room.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm">
                      {feature.includes("Baño") && <Bed className="h-3 w-3 mr-1" />}
                      {feature.includes("WiFi") && <Wifi className="h-3 w-3 mr-1" />}
                      {feature.includes("Desayuno") && <Coffee className="h-3 w-3 mr-1" />}
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div>
                  <span className="font-bold text-lg">${room.price}</span>
                  <span className="text-muted-foreground text-sm"> / noche</span>
                </div>
                <Button variant="default" size="sm" className="bg-terracotta hover:bg-terracotta/90" asChild>
                  <Link to={`/habitacion/${room.id}`}>Ver detalles</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No se encontraron habitaciones</h3>
            <p className="text-muted-foreground">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default RoomsList

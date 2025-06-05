"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, DollarSign, Home, CheckCircle, XCircle, Eye, Sliders } from "lucide-react"

interface RoomFiltersProps {
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  roomType: string
  setRoomType: (type: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  availabilityFilter: "all" | "available" | "unavailable"
  setAvailabilityFilter: (filter: "all" | "available" | "unavailable") => void
  priceStats: { min: number; max: number; avg: number }
}

const RoomFilters = ({
  priceRange,
  setPriceRange,
  roomType,
  setRoomType,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  availabilityFilter,
  setAvailabilityFilter,
  priceStats,
}: RoomFiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value)
    // Aplicar cambio con debounce
    setTimeout(() => setPriceRange(value), 300)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setPriceRange([priceStats.min, priceStats.max])
    setLocalPriceRange([priceStats.min, priceStats.max])
    setRoomType("all")
    setAvailabilityFilter("available")
  }

  const hasActiveFilters =
    searchTerm ||
    priceRange[0] !== priceStats.min ||
    priceRange[1] !== priceStats.max ||
    roomType !== "all" ||
    availabilityFilter !== "available"

  return (
    <div className="mb-8 space-y-4">
      {/* Barra de búsqueda y controles principales */}
      <Card className="bg-white/80 backdrop-blur-sm border-muted shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Búsqueda */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, ubicación o características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-muted focus:border-orange-500 transition-colors"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filtros de disponibilidad */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={availabilityFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("available")}
                className={`transition-all duration-200 ${
                  availabilityFilter === "available"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Disponibles
              </Button>
              <Button
                variant={availabilityFilter === "unavailable" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("unavailable")}
                className={`transition-all duration-200 ${
                  availabilityFilter === "unavailable"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                }`}
              >
                <XCircle className="h-4 w-4 mr-1" />
                No disponibles
              </Button>
              <Button
                variant={availabilityFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter("all")}
                className={`transition-all duration-200 ${
                  availabilityFilter === "all"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                <Eye className="h-4 w-4 mr-1" />
                Todas
              </Button>
            </div>

            {/* Botón de filtros avanzados */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`transition-all duration-200 ${
                showFilters ? "bg-orange-50 border-orange-200 text-orange-600" : ""
              }`}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && <Badge className="ml-2 bg-orange-500 text-white">!</Badge>}
            </Button>

            {/* Limpiar filtros */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground transition-colors animate-in zoom-in-50 duration-200"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <Card className="bg-white/80 backdrop-blur-sm border-muted shadow-lg animate-in slide-in-from-top-2 duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-orange-500" />
              Filtros Avanzados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filtro de precio */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <Label className="font-medium">Rango de Precio</Label>
                </div>
                <div className="px-2">
                  <Slider
                    value={localPriceRange}
                    onValueChange={handlePriceChange}
                    max={priceStats.max}
                    min={priceStats.min}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${localPriceRange[0]}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">Promedio: ${priceStats.avg}</span>
                    <span>${localPriceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Tipo de habitación */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-500" />
                  <Label className="font-medium">Tipo de Habitación</Label>
                </div>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="bg-white/50 border-muted focus:border-orange-500">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="doble">Doble</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="familiar">Familiar</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Información adicional */}
              <div className="space-y-3">
                <Label className="font-medium">Información</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio mínimo:</span>
                    <span className="font-medium">${priceStats.min}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio máximo:</span>
                    <span className="font-medium">${priceStats.max}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio promedio:</span>
                    <span className="font-medium text-orange-600">${priceStats.avg}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RoomFilters

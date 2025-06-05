"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import RoomCard from "./RoomCard"
import type { Room } from "@/types/room"
import { Grid3X3, List, ArrowUpDown, ArrowUp, ArrowDown, Home, Search } from "lucide-react"

interface RoomGridProps {
  rooms: Room[]
}

type ViewMode = "grid" | "list"
type SortField = "name" | "price" | "rating"
type SortOrder = "asc" | "desc"

const RoomGrid = ({ rooms }: RoomGridProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Ordenar habitaciones
  const sortedRooms = [...rooms].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case "name":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "price":
        aValue = a.price || 0
        bValue = b.price || 0
        break
      case "rating":
        aValue = a.rating || 0
        bValue = b.rating || 0
        break
      default:
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  if (rooms.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-dashed animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground">No se encontraron habitaciones</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Intenta ajustar los filtros o términos de búsqueda para encontrar más opciones.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles de vista y ordenamiento */}
      <Card className="bg-white/80 backdrop-blur-sm border-muted">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Información de resultados */}
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {rooms.length} habitación{rooms.length !== 1 ? "es" : ""} encontrada
                {rooms.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Selector de ordenamiento */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar por:</span>
                <div className="flex gap-1">
                  <Button
                    variant={sortField === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("name")}
                    className="transition-all duration-200"
                  >
                    Nombre {getSortIcon("name")}
                  </Button>
                  <Button
                    variant={sortField === "price" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("price")}
                    className="transition-all duration-200"
                  >
                    Precio {getSortIcon("price")}
                  </Button>
                  <Button
                    variant={sortField === "rating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("rating")}
                    className="transition-all duration-200"
                  >
                    Rating {getSortIcon("rating")}
                  </Button>
                </div>
              </div>

              {/* Selector de vista */}
              <div className="flex gap-1 border rounded-lg p-1 bg-muted/50">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0 transition-all duration-200"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0 transition-all duration-200"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid/Lista de habitaciones */}
      <div
        className={`
          ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
        `}
      >
        {sortedRooms.map((room, index) => (
          <div
            key={room.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <RoomCard room={room} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Información adicional */}
      {rooms.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 border-muted">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                {rooms.filter((room) => room.available !== false).length}
              </Badge>
              <span>Disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                {rooms.filter((room) => room.available === false).length}
              </Badge>
              <span>No disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                {rooms.filter((room) => room.whatsappNumber).length}
              </Badge>
              <span>Con WhatsApp</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default RoomGrid

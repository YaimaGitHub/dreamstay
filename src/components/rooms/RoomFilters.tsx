"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

interface RoomFiltersProps {
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  roomType: string
  setRoomType: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  showFilters: boolean
  setShowFilters: (value: boolean) => void
  showUnavailable: boolean
  setShowUnavailable: (value: boolean) => void
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
  showUnavailable,
  setShowUnavailable,
}: RoomFiltersProps) => {
  return (
    <>
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
                <div className="flex items-center mt-4">
                  <Checkbox
                    id="showUnavailable"
                    checked={showUnavailable}
                    onCheckedChange={(checked) => setShowUnavailable(checked === true)}
                  />
                  <label htmlFor="showUnavailable" className="ml-2 text-sm font-medium">
                    Mostrar habitaciones no disponibles
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RoomFilters

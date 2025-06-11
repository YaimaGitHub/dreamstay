"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Bed, Bath, DoorOpen } from "lucide-react"
import type { RoomCapacity } from "@/types/room"

interface RoomCapacityManagerProps {
  capacity: RoomCapacity
  accommodationType: string
  onCapacityChange: (capacity: RoomCapacity) => void
  onAccommodationTypeChange: (type: string) => void
}

const accommodationTypes = [
  "Habitación privada",
  "Habitación compartida",
  "Casa entera",
  "Apartamento entero",
  "Habitación en alojamiento entero",
  "Villa completa",
  "Cabaña completa",
]

const RoomCapacityManager: React.FC<RoomCapacityManagerProps> = ({
  capacity,
  accommodationType,
  onCapacityChange,
  onAccommodationTypeChange,
}) => {
  const handleCapacityChange = (field: keyof RoomCapacity, value: number) => {
    onCapacityChange({
      ...capacity,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Capacidad y Tipo de Alojamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de alojamiento */}
        <div className="space-y-2">
          <Label htmlFor="accommodation-type">Tipo de Alojamiento</Label>
          <Select value={accommodationType} onValueChange={onAccommodationTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de alojamiento" />
            </SelectTrigger>
            <SelectContent>
              {accommodationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capacidad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max-guests">Máximo de Huéspedes</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="max-guests"
                type="number"
                min="1"
                max="20"
                value={capacity.maxGuests}
                onChange={(e) => handleCapacityChange("maxGuests", Number.parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beds">Número de Camas</Label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="beds"
                type="number"
                min="1"
                max="10"
                value={capacity.beds}
                onChange={(e) => handleCapacityChange("beds", Number.parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bedrooms">Número de Cuartos</Label>
            <div className="relative">
              <DoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bedrooms"
                type="number"
                min="1"
                max="10"
                value={capacity.bedrooms}
                onChange={(e) => handleCapacityChange("bedrooms", Number.parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Número de Baños</Label>
            <div className="relative">
              <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="bathrooms"
                type="number"
                min="1"
                max="5"
                value={capacity.bathrooms}
                onChange={(e) => handleCapacityChange("bathrooms", Number.parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium mb-3">Vista Previa:</h4>
          <div className="space-y-2">
            <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
              {accommodationType}
            </Badge>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{capacity.maxGuests} huéspedes</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>
                  {capacity.beds} cama{capacity.beds > 1 ? "s" : ""}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <DoorOpen className="h-4 w-4" />
                <span>
                  {capacity.bedrooms} cuarto{capacity.bedrooms > 1 ? "s" : ""}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>
                  {capacity.bathrooms} baño{capacity.bathrooms > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoomCapacityManager

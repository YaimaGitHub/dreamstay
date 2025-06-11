import { Users, Bed, Home, Bath } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { RoomCapacity } from "@/types/room"

interface RoomCapacityDisplayProps {
  capacity?: RoomCapacity
  accommodationType?: string
  className?: string
}

const RoomCapacityDisplay = ({ capacity, accommodationType, className = "" }: RoomCapacityDisplayProps) => {
  // Valores por defecto si no se proporciona capacidad
  const displayCapacity: RoomCapacity = capacity || {
    maxGuests: 4,
    beds: 1,
    bedrooms: 1,
    bathrooms: 1,
  }

  const displayType = accommodationType || "Habitación en alojamiento entero"

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold">Detalles del alojamiento</h2>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">{displayType}</h3>
            <p className="text-muted-foreground">
              {displayCapacity.maxGuests} huéspedes • {displayCapacity.bedrooms} habitación
              {displayCapacity.bedrooms !== 1 ? "es" : ""} • {displayCapacity.beds} cama
              {displayCapacity.beds !== 1 ? "s" : ""} • {displayCapacity.bathrooms} baño
              {displayCapacity.bathrooms !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-medium">{displayCapacity.maxGuests}</span>
              <span className="text-sm text-muted-foreground">huéspedes</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Bed className="h-6 w-6 text-purple-600" />
              </div>
              <span className="font-medium">{displayCapacity.beds}</span>
              <span className="text-sm text-muted-foreground">cama{displayCapacity.beds !== 1 ? "s" : ""}</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Home className="h-6 w-6 text-amber-600" />
              </div>
              <span className="font-medium">{displayCapacity.bedrooms}</span>
              <span className="text-sm text-muted-foreground">
                habitación{displayCapacity.bedrooms !== 1 ? "es" : ""}
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Bath className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-medium">{displayCapacity.bathrooms}</span>
              <span className="text-sm text-muted-foreground">baño{displayCapacity.bathrooms !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomCapacityDisplay

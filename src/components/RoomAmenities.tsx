import { Card } from "@/components/ui/card"
import { Wifi, Tv, Coffee, Wind, Droplet, BedDouble } from "lucide-react"
import { cn } from "@/lib/utils"

interface Amenity {
  id?: number
  title: string
  description: string
  icon?: string
}

interface RoomAmenitiesProps {
  amenities: Amenity[] | string[]
}

// Función para obtener el icono basado en el título
const getIconByTitle = (title: string) => {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes("wifi")) return <Wifi className="h-5 w-5" />
  if (lowerTitle.includes("tv") || lowerTitle.includes("television")) return <Tv className="h-5 w-5" />
  if (lowerTitle.includes("desayuno") || lowerTitle.includes("comida")) return <Coffee className="h-5 w-5" />
  if (lowerTitle.includes("aire") || lowerTitle.includes("clima")) return <Wind className="h-5 w-5" />
  if (lowerTitle.includes("baño") || lowerTitle.includes("ducha")) return <Droplet className="h-5 w-5" />
  if (lowerTitle.includes("cama") || lowerTitle.includes("king") || lowerTitle.includes("queen"))
    return <BedDouble className="h-5 w-5" />

  // Icono por defecto
  return <BedDouble className="h-5 w-5" />
}

// Función para convertir strings a objetos de amenidad
const formatAmenities = (amenities: string[] | Amenity[]): Amenity[] => {
  if (!amenities || amenities.length === 0) return []

  if (typeof amenities[0] === "string") {
    // Si son strings, convertirlos a objetos
    return (amenities as string[]).map((item, index) => {
      // Intentar dividir por líneas o por un delimitador específico
      const parts = item.split("\n")
      if (parts.length > 1) {
        return {
          id: index,
          title: parts[0].trim(),
          description: parts.slice(1).join(" ").trim(),
        }
      }

      // Si no hay delimitador claro, usar todo como título
      return {
        id: index,
        title: item,
        description: "",
      }
    })
  }

  // Ya son objetos de amenidad
  return amenities as Amenity[]
}

const RoomAmenities = ({ amenities }: RoomAmenitiesProps) => {
  const formattedAmenities = formatAmenities(amenities)

  if (formattedAmenities.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Lo que ofrece esta habitación</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formattedAmenities.map((amenity, index) => (
          <Card key={index} className={cn("p-4 flex items-start hover:shadow-md transition-shadow")}>
            <div className="mr-4 text-terracotta">{getIconByTitle(amenity.title)}</div>
            <div>
              <h4 className="font-medium">{amenity.title}</h4>
              {amenity.description && <p className="text-muted-foreground text-sm mt-1">{amenity.description}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RoomAmenities

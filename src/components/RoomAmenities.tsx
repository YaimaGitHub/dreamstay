import { Card } from "@/components/ui/card"
import { Bed, Wifi, Coffee, Tv, Bath, Wind } from "lucide-react"

interface Amenity {
  id: number
  name: string
  description: string
  icon: JSX.Element
}

interface RoomAmenitiesProps {
  amenities: Amenity[]
}

const RoomAmenities = ({ amenities }: RoomAmenitiesProps) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Lo que ofrece esta habitación</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity) => (
          <Card key={amenity.id} className="p-4 flex items-start">
            <div className="mr-3 text-terracotta">{amenity.icon}</div>
            <div>
              <h4 className="font-medium">{amenity.name}</h4>
              <p className="text-sm text-muted-foreground">{amenity.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Datos de muestra para usar en las páginas
export const sampleAmenities: Amenity[] = [
  {
    id: 1,
    name: "Cama king size",
    description: "Cama de alta calidad con ropa de cama premium",
    icon: <Bed className="h-5 w-5" />,
  },
  {
    id: 2,
    name: "WiFi de alta velocidad",
    description: "Conexión de Internet rápida y confiable",
    icon: <Wifi className="h-5 w-5" />,
  },
  {
    id: 3,
    name: "Desayuno incluido",
    description: "Desayuno buffet con opciones frescas y locales",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    id: 4,
    name: "Smart TV",
    description: "TV de 55 pulgadas con Netflix y Amazon Prime",
    icon: <Tv className="h-5 w-5" />,
  },
  {
    id: 5,
    name: "Baño de lujo",
    description: "Con ducha de lluvia y productos orgánicos",
    icon: <Bath className="h-5 w-5" />,
  },
  {
    id: 6,
    name: "Aire acondicionado",
    description: "Control de temperatura individual",
    icon: <Wind className="h-5 w-5" />,
  },
]

export default RoomAmenities

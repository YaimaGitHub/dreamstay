import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bed, Wifi, Coffee, Star } from "lucide-react"
import { Link } from "react-router-dom"

// Datos de muestra para las habitaciones destacadas
const featuredRooms = [
  {
    id: 1,
    title: "Suite Premium",
    location: "Centro de la ciudad",
    price: 120,
    rating: 4.9,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    features: ["Baño privado", "WiFi gratis", "Desayuno incluido"],
  },
  {
    id: 2,
    title: "Habitación Confort",
    location: "Zona Turística",
    price: 85,
    rating: 4.7,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    features: ["Baño privado", "WiFi gratis", "TV de pantalla plana"],
  },
  {
    id: 3,
    title: "Suite Ejecutiva",
    location: "Distrito Financiero",
    price: 150,
    rating: 5.0,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    features: ["Baño de lujo", "WiFi de alta velocidad", "Desayuno gourmet"],
  },
]

const FeaturedRooms = () => {
  return (
    <section className="py-16 container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Habitaciones Destacadasssss</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubre nuestras habitaciones más populares, diseñadas para proporcionar máximo confort y elegancia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden card-hover border border-border/50">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{room.title}</h3>
                  <p className="text-muted-foreground text-sm">{room.location}</p>
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

      <div className="text-center mt-12">
        <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta/10" asChild>
          <Link to="/habitaciones">Ver todas las habitaciones</Link>
        </Button>
      </div>
    </section>
  )
}

export default FeaturedRooms

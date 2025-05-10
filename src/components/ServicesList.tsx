import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Car, Wifi, Coffee, Utensils, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"

// Función para obtener el icono según la categoría y título del servicio
const getServiceIcon = (category: string, title: string) => {
  if (title.toLowerCase().includes("traslado") || title.toLowerCase().includes("aeropuerto")) {
    return <Plane className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("vehículo") || title.toLowerCase().includes("alquiler")) {
    return <Car className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("tour") || title.toLowerCase().includes("guiado")) {
    return <MapPin className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("wifi") || title.toLowerCase().includes("internet")) {
    return <Wifi className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("desayuno") || title.toLowerCase().includes("café")) {
    return <Coffee className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("restaurante") || title.toLowerCase().includes("comida")) {
    return <Utensils className="h-8 w-8 text-terracotta" />
  } else {
    // Icono por defecto según la categoría
    switch (category) {
      case "transporte":
        return <Car className="h-8 w-8 text-terracotta" />
      case "gastronomía":
        return <Utensils className="h-8 w-8 text-terracotta" />
      case "comodidades":
        return <Wifi className="h-8 w-8 text-terracotta" />
      case "experiencias":
        return <MapPin className="h-8 w-8 text-terracotta" />
      default:
        return <Utensils className="h-8 w-8 text-terracotta" />
    }
  }
}

const ServicesList = () => {
  const { services } = useDataStore()

  // Mostrar solo 6 servicios en la página principal
  const displayedServices = services.slice(0, 6)

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Servicios Adicionales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personaliza tu estancia con nuestros servicios adicionales diseñados para hacer tu experiencia inolvidable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
            <Card key={service.id} className="card-hover border border-border/50 bg-card">
              <CardHeader>
                <div className="mb-3">{getServiceIcon(service.category, service.title)}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="font-bold">{service.price > 0 ? `$${service.price}` : "Incluido"}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-terracotta text-terracotta hover:bg-terracotta/10"
                >
                  Añadir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="default" className="bg-terracotta hover:bg-terracotta/90" asChild>
            <Link to="/servicios">Ver todos los servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServicesList

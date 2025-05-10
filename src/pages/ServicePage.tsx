import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Car, MapPin, Coffee, Utensils, Wifi, Shirt, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from "@/hooks/use-data-store"
import { Link } from "react-router-dom"

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
  } else if (title.toLowerCase().includes("lavandería") || title.toLowerCase().includes("ropa")) {
    return <Shirt className="h-8 w-8 text-terracotta" />
  } else if (title.toLowerCase().includes("concierge") || title.toLowerCase().includes("asistencia")) {
    return <Key className="h-8 w-8 text-terracotta" />
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
        return <Key className="h-8 w-8 text-terracotta" />
    }
  }
}

const ServicePage = () => {
  const { services } = useDataStore()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-deepblue text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Servicios Adicionales</h1>
              <p className="text-lg opacity-90 mb-8">
                Personaliza tu estancia con nuestra amplia gama de servicios premium diseñados para hacer de tu
                experiencia algo verdaderamente excepcional.
              </p>
              <Button className="bg-terracotta hover:bg-terracotta/90" asChild>
                <Link to="/habitaciones">Reserva tu habitación</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <Tabs defaultValue="todos">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="transporte">Transporte</TabsTrigger>
                <TabsTrigger value="gastronomía">Gastronomía</TabsTrigger>
                <TabsTrigger value="comodidades">Comodidades</TabsTrigger>
                <TabsTrigger value="experiencias">Experiencias</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="todos" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="card-hover border border-border/50">
                    <CardHeader>
                      <div className="mb-3">{getServiceIcon(service.category, service.title)}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Características:</h4>
                        <ul className="space-y-1">
                          {service.features && service.features.length > 0 ? (
                            service.features.map((feature, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-center">
                                <span className="mr-2 text-terracotta">•</span>
                                {feature}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-muted-foreground">Información no disponible</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{service.price > 0 ? `$${service.price}` : "Incluido"}</span>
                        <Button size="sm" className="bg-terracotta hover:bg-terracotta/90">
                          Añadir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {["transporte", "gastronomía", "comodidades", "experiencias"].map((category) => (
              <TabsContent key={category} value={category} className="animate-fade-in">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services
                    .filter((service) => service.category === category)
                    .map((service) => (
                      <Card key={service.id} className="card-hover border border-border/50">
                        <CardHeader>
                          <div className="mb-3">{getServiceIcon(service.category, service.title)}</div>
                          <CardTitle>{service.title}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Características:</h4>
                            <ul className="space-y-1">
                              {service.features && service.features.length > 0 ? (
                                service.features.map((feature, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-center">
                                    <span className="mr-2 text-terracotta">•</span>
                                    {feature}
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-muted-foreground">Información no disponible</li>
                              )}
                            </ul>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold">{service.price > 0 ? `$${service.price}` : "Incluido"}</span>
                            <Button size="sm" className="bg-terracotta hover:bg-terracotta/90">
                              Añadir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="py-12 bg-cream">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Necesitas un servicio personalizado?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Si tienes alguna solicitud especial o necesitas un servicio que no encuentras en nuestra lista, no dudes
              en contactarnos. Haremos todo lo posible para satisfacer tus necesidades.
            </p>
            <Button className="bg-terracotta hover:bg-terracotta/90" asChild>
              <Link to="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ServicePage

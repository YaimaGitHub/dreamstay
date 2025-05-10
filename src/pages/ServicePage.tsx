import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Car, MapPin, Coffee, Utensils, Wifi, Shirt, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de muestra para los servicios
const allServices = [
  {
    id: 1,
    title: "Traslado desde el aeropuerto",
    description: "Te recogemos en el aeropuerto y te llevamos directamente a tu habitación.",
    longDescription:
      "Nuestro servicio de traslado premium te garantiza un viaje cómodo desde el aeropuerto hasta tu alojamiento. Contamos con conductores profesionales y vehículos modernos totalmente equipados para que tu viaje sea placentero. Confirmamos tu vuelo de antemano y nos aseguramos de estar esperándote a tu llegada.",
    price: 25,
    category: "transporte",
    icon: <Plane className="h-8 w-8 text-terracotta" />,
    features: [
      "Monitoreo de vuelos en tiempo real",
      "Espera de hasta 60 minutos sin cargo adicional",
      "Vehículos confortables y modernos",
      "Conductores profesionales que hablan varios idiomas",
    ],
  },
  {
    id: 2,
    title: "Alquiler de vehículos",
    description: "Contamos con una flota de vehículos disponibles para que explores la ciudad.",
    longDescription:
      "Explora los alrededores a tu ritmo con nuestro servicio de alquiler de vehículos. Ofrecemos una amplia gama de opciones, desde económicos hasta de lujo. Todos nuestros vehículos se mantienen en excelentes condiciones y se limpian a fondo entre alquileres. Incluimos seguro básico y asistencia en carretera 24/7.",
    price: 45,
    category: "transporte",
    icon: <Car className="h-8 w-8 text-terracotta" />,
    features: [
      "Kilometraje ilimitado",
      "Seguro básico incluido",
      "Entrega y recogida en el alojamiento",
      "Modelos recientes y bien mantenidos",
    ],
  },
  {
    id: 3,
    title: "Tours guiados",
    description: "Conoce los mejores lugares de la ciudad con nuestros guías expertos.",
    longDescription:
      "Descubre los secretos locales, la historia y la cultura con nuestros tours guiados personalizados. Nuestros guías son locales apasionados con amplio conocimiento de la zona y te mostrarán tanto los lugares turísticos populares como gemas ocultas que solo los lugareños conocen. Ofrecemos tours a pie, en bicicleta o en vehículo, según tus preferencias.",
    price: 30,
    category: "experiencias",
    icon: <MapPin className="h-8 w-8 text-terracotta" />,
    features: [
      "Guías locales expertos certificados",
      "Grupos pequeños para experiencia personalizada",
      "Variedad de rutas disponibles",
      "Incluye entrada a atracciones seleccionadas",
    ],
  },
  {
    id: 4,
    title: "WiFi de alta velocidad",
    description: "Conexión premium para que puedas trabajar o entretenerte sin interrupciones.",
    longDescription:
      "Mantente conectado con nuestra red WiFi premium de alta velocidad, ideal para streaming, videollamadas o trabajo remoto. Ofrecemos velocidades superiores a 300 Mbps con conexión estable en toda la propiedad. Cada habitación cuenta con su propio repetidor para garantizar una señal potente en todo momento.",
    price: 10,
    category: "comodidades",
    icon: <Wifi className="h-8 w-8 text-terracotta" />,
    features: [
      "Velocidad de 300+ Mbps",
      "Conexión segura y encriptada",
      "Soporte técnico disponible",
      "Sin límite de dispositivos",
    ],
  },
  {
    id: 5,
    title: "Desayuno gourmet",
    description: "Disfruta de un desayuno completo preparado con ingredientes locales y frescos.",
    longDescription:
      "Comienza tu día con un delicioso desayuno gourmet servido en tu habitación o en nuestro comedor. Utilizamos ingredientes frescos y locales para crear una experiencia culinaria excepcional. Ofrecemos opciones vegetarianas, veganas y para dietas especiales, solo tienes que avisarnos con anticipación.",
    price: 15,
    category: "gastronomía",
    icon: <Coffee className="h-8 w-8 text-terracotta" />,
    features: [
      "Ingredientes frescos y locales",
      "Opciones para dietas especiales disponibles",
      "Servido entre 7:00 y 10:30 AM",
      "Incluye café de especialidad o té gourmet",
    ],
  },
  {
    id: 6,
    title: "Servicio de restaurante",
    description: "Saborea la gastronomía local en nuestro restaurante o en la comodidad de tu habitación.",
    longDescription:
      "Nuestro servicio de restaurante ofrece lo mejor de la gastronomía local e internacional. Puedes disfrutarlo en nuestro elegante comedor o pedir que te lo lleven a tu habitación sin costo adicional. Nuestro chef utiliza ingredientes de temporada para crear platos exclusivos que deleitarán tu paladar.",
    price: 20,
    category: "gastronomía",
    icon: <Utensils className="h-8 w-8 text-terracotta" />,
    features: [
      "Menú variado con opciones locales e internacionales",
      "Servicio a la habitación sin cargo adicional",
      "Horario de comidas extendido",
      "Bar de cócteles premium",
    ],
  },
  {
    id: 7,
    title: "Servicio de lavandería",
    description: "Servicio express de lavado y planchado disponible todos los días.",
    longDescription:
      "Mantén tu ropa impecable durante tu estancia con nuestro servicio de lavandería premium. Ofrecemos lavado, secado y planchado con la máxima atención a los detalles. El servicio estándar se entrega en 24 horas, pero también disponemos de servicio express con entrega en el mismo día para emergencias.",
    price: 18,
    category: "comodidades",
    icon: <Shirt className="h-8 w-8 text-terracotta" />,
    features: [
      "Servicio estándar (24h) y express (mismo día)",
      "Cuidado especial para prendas delicadas",
      "Planchado profesional",
      "Recogida y entrega en tu habitación",
    ],
  },
  {
    id: 8,
    title: "Servicio de concierge",
    description: "Asistencia personalizada para reservas, recomendaciones y más.",
    longDescription:
      "Nuestro servicio de concierge está disponible 24/7 para ayudarte con cualquier solicitud durante tu estancia. Podemos ayudarte con reservas en restaurantes, entradas para eventos, recomendaciones locales, y cualquier otra necesidad que puedas tener. Nuestro experimentado equipo se asegurará de que tu estancia sea perfecta en todos los aspectos.",
    price: 0,
    category: "experiencias",
    icon: <Key className="h-8 w-8 text-terracotta" />,
    features: [
      "Disponible 24 horas al día, 7 días a la semana",
      "Reservas en restaurantes locales",
      "Información turística personalizada",
      "Gestión de transporte y servicios especiales",
    ],
  },
]

const ServicePage = () => {
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
              <Button className="bg-terracotta hover:bg-terracotta/90">Reserva tu habitación</Button>
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
                {allServices.map((service) => (
                  <Card key={service.id} className="card-hover border border-border/50">
                    <CardHeader>
                      <div className="mb-3">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Características:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <span className="mr-2 text-terracotta">•</span>
                              {feature}
                            </li>
                          ))}
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
                  {allServices
                    .filter((service) => service.category === category)
                    .map((service) => (
                      <Card key={service.id} className="card-hover border border-border/50">
                        <CardHeader>
                          <div className="mb-3">{service.icon}</div>
                          <CardTitle>{service.title}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Características:</h4>
                            <ul className="space-y-1">
                              {service.features.map((feature, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-center">
                                  <span className="mr-2 text-terracotta">•</span>
                                  {feature}
                                </li>
                              ))}
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
            <Button className="bg-terracotta hover:bg-terracotta/90">Contáctanos</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default ServicePage

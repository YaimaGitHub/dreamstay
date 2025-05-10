
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Car, Wifi, Coffee, Utensils, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Traslado desde el aeropuerto",
    description: "Te recogemos en el aeropuerto y te llevamos directamente a tu habitación.",
    icon: <Plane className="h-8 w-8 text-terracotta" />,
    price: 25,
  },
  {
    id: 2,
    title: "Alquiler de vehículos",
    description: "Contamos con una flota de vehículos disponibles para que explores la ciudad.",
    icon: <Car className="h-8 w-8 text-terracotta" />,
    price: 45,
  },
  {
    id: 3,
    title: "WiFi de alta velocidad",
    description: "Conexión premium para que puedas trabajar o entretenerte sin interrupciones.",
    icon: <Wifi className="h-8 w-8 text-terracotta" />,
    price: 10,
  },
  {
    id: 4,
    title: "Desayuno gourmet",
    description: "Disfruta de un desayuno completo preparado con ingredientes locales y frescos.",
    icon: <Coffee className="h-8 w-8 text-terracotta" />,
    price: 15,
  },
  {
    id: 5,
    title: "Tours guiados",
    description: "Conoce los mejores lugares de la ciudad con nuestros guías expertos.",
    icon: <MapPin className="h-8 w-8 text-terracotta" />,
    price: 30,
  },
  {
    id: 6,
    title: "Servicio de restaurante",
    description: "Saborea la gastronomía local en nuestro restaurante o en la comodidad de tu habitación.",
    icon: <Utensils className="h-8 w-8 text-terracotta" />,
    price: 20,
  },
];

const ServicesList = () => {
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
          {services.map((service) => (
            <Card key={service.id} className="card-hover border border-border/50 bg-card">
              <CardHeader>
                <div className="mb-3">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="font-bold">${service.price}</span>
                <Button size="sm" variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta/10">
                  Añadir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="default" 
            className="bg-terracotta hover:bg-terracotta/90"
            asChild
          >
            <Link to="/servicios">Ver todos los servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesList;

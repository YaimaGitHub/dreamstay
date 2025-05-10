
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Car, MapPin, Utensils, Plus, Check } from "lucide-react";
import { useState } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  icon: JSX.Element;
}

interface AdditionalServicesProps {
  services: Service[];
  onServiceToggle?: (serviceId: number, isSelected: boolean) => void;
}

const AdditionalServices = ({ services, onServiceToggle }: AdditionalServicesProps) => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });

    if (onServiceToggle) {
      onServiceToggle(serviceId, !selectedServices.includes(serviceId));
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Servicios adicionales</h3>
      <p className="text-muted-foreground mb-6">
        Mejora tu estancia con estos servicios personalizados
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <Card 
              key={service.id} 
              className={`p-4 border ${
                isSelected ? "border-terracotta bg-terracotta/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-3 text-terracotta">{service.icon}</div>
                  <div>
                    <h4 className="font-medium">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-sm font-bold mt-1">${service.price}</p>
                  </div>
                </div>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="icon"
                  className={isSelected ? "bg-terracotta hover:bg-terracotta/90" : "border-terracotta text-terracotta"}
                  onClick={() => toggleService(service.id)}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Datos de muestra para usar en las páginas
export const sampleServices: Service[] = [
  {
    id: 1,
    title: "Traslado desde el aeropuerto",
    description: "Servicio de recogida y traslado a tu habitación",
    price: 25,
    icon: <Plane className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Alquiler de vehículo",
    description: "Vehículo disponible durante toda tu estancia",
    price: 45,
    icon: <Car className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Tour guiado por la ciudad",
    description: "Conoce los lugares más emblemáticos",
    price: 30,
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Cena gourmet en la habitación",
    description: "Una experiencia culinaria única",
    price: 40,
    icon: <Utensils className="h-5 w-5" />,
  },
];

export default AdditionalServices;

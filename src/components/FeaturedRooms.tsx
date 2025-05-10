
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Wifi, Coffee, Star } from "lucide-react";
import { useRoomStore } from "@/contexts/RoomStoreContext";

const FeaturedRooms = () => {
  const { rooms } = useRoomStore();
  
  // Only show available rooms in the featured section
  const availableRooms = rooms.filter(room => room.isAvailable).slice(0, 3);

  return (
    <section className="py-16 container mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Habitaciones Destacadas</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubre nuestras habitaciones más populares, diseñadas para proporcionar máximo confort y elegancia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableRooms.map((room) => (
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
              <Button 
                variant="default" 
                size="sm" 
                className="bg-terracotta hover:bg-terracotta/90"
                asChild
              >
                <Link to={`/habitacion/${room.id}`}>Ver detalles</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          className="border-terracotta text-terracotta hover:bg-terracotta/10 mr-4"
          asChild
        >
          <Link to="/habitaciones">Ver todas las habitaciones</Link>
        </Button>
        <Button 
          variant="outline" 
          className="border-deepblue text-deepblue hover:bg-deepblue/10"
          asChild
        >
          <Link to="/admin/login">Panel administrativo</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedRooms;

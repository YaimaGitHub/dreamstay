
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bed, Coffee, Star, Wifi } from "lucide-react";
import { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

const RoomCard = ({ room }: RoomCardProps) => {
  // Utilizar available como fuente de verdad
  const isRoomAvailable = room.available !== false;

  return (
    <Card className={`overflow-hidden card-hover border border-border/50 ${!isRoomAvailable ? 'opacity-70' : ''}`}>
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        {!isRoomAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-md">
              No disponible
            </span>
          </div>
        )}
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
          {room.features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center text-sm">
              {feature.includes("Baño") && <Bed className="h-3 w-3 mr-1" />}
              {feature.includes("WiFi") && <Wifi className="h-3 w-3 mr-1" />}
              {feature.includes("Desayuno") && <Coffee className="h-3 w-3 mr-1" />}
              {feature}
            </div>
          ))}
          {room.features.length > 3 && (
            <div className="text-sm text-muted-foreground">
              +{room.features.length - 3} más
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          <span className="font-bold text-lg">${room.price}</span>
          <span className="text-muted-foreground text-sm"> / noche</span>
        </div>
        <Button 
          variant={isRoomAvailable ? "default" : "outline"}
          size="sm" 
          className={isRoomAvailable ? "bg-terracotta hover:bg-terracotta/90" : ""}
          asChild
        >
          <Link to={`/habitacion/${room.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;

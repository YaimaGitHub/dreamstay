import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Wifi, Coffee, Star, Search, SlidersHorizontal } from "lucide-react";

// Datos de muestra para las habitaciones
const roomsData = [
  {
    id: 1,
    title: "Suite Premium",
    location: "Centro de la ciudad",
    price: 120,
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    features: ["Baño privado", "WiFi gratis", "Desayuno incluido"],
    type: "Suite",
    area: 35
  },
  {
    id: 2,
    title: "Habitación Confort",
    location: "Zona Turística",
    price: 85,
    rating: 4.7,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    features: ["Baño privado", "WiFi gratis", "TV de pantalla plana"],
    type: "Estándar",
    area: 25
  },
  {
    id: 3,
    title: "Suite Ejecutiva",
    location: "Distrito Financiero",
    price: 150,
    rating: 5.0,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    features: ["Baño de lujo", "WiFi de alta velocidad", "Desayuno gourmet"],
    type: "Suite",
    area: 40
  },
  {
    id: 4,
    title: "Habitación Familiar",
    location: "Zona Residencial",
    price: 110,
    rating: 4.6,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1505692952047-9e5ddd7c1664?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    features: ["2 camas dobles", "WiFi gratis", "TV por cable"],
    type: "Familiar",
    area: 38
  },
  {
    id: 5,
    title: "Habitación Económica",
    location: "Cerca del centro",
    price: 65,
    rating: 4.3,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    features: ["Baño compartido", "WiFi gratis", "Escritorio"],
    type: "Económica",
    area: 18
  },
  {
    id: 6,
    title: "Junior Suite",
    location: "Zona Comercial",
    price: 130,
    rating: 4.8,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    features: ["Minibar", "WiFi gratis", "Desayuno buffet"],
    type: "Suite",
    area: 32
  },
];

const RoomsList = () => {
  const [priceRange, setPriceRange] = useState<number[]>([50, 200]);
  const [roomType, setRoomType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filtrar habitaciones
  const filteredRooms = roomsData.filter((room) => {
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    const matchesType = roomType === "all" || room.type === roomType;
    const matchesSearch = searchTerm === "" || 
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPrice && matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Nuestras Habitaciones</h1>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Buscar habitaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-64"
            />
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-terracotta text-terracotta"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Precio por noche</label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    min={50}
                    max={200}
                    step={5}
                    onValueChange={(value) => setPriceRange(value)}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de habitación</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Familiar">Familiar</SelectItem>
                    <SelectItem value="Económica">Económica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Servicios</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="wifi" />
                    <label htmlFor="wifi" className="ml-2 text-sm">WiFi gratis</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="breakfast" />
                    <label htmlFor="breakfast" className="ml-2 text-sm">Desayuno incluido</label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="bathroom" />
                    <label htmlFor="bathroom" className="ml-2 text-sm">Baño privado</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
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

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No se encontraron habitaciones</h3>
            <p className="text-muted-foreground">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RoomsList;

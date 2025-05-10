
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomGallery from "@/components/RoomGallery";
import BookingForm from "@/components/BookingForm";
import RoomAmenities from "@/components/RoomAmenities";
import AdditionalServices from "@/components/AdditionalServices";
import { Star, User, MapPin } from "lucide-react";
import { useRoomStore } from "@/contexts/RoomStoreContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { rooms } = useRoomStore();
  const navigate = useNavigate();
  
  const roomId = parseInt(id || "0");
  const room = rooms.find(r => r.id === roomId);

  useEffect(() => {
    if (!room) {
      navigate("/habitaciones");
    }
  }, [room, navigate]);

  if (!room) {
    return null;
  }

  // Fix: Create compatible amenities for RoomAmenities component
  const amenities = room.features.map((feature, index) => {
    let icon = "bed";
    if (feature.toLowerCase().includes("wifi")) {
      icon = "wifi";
    } else if (feature.toLowerCase().includes("baño")) {
      icon = "bath";
    } else if (feature.toLowerCase().includes("desayuno")) {
      icon = "coffee";
    }
    
    return {
      id: index + 1,
      name: feature,
      icon: icon,
      description: `Disfruta de ${feature.toLowerCase()} en tu habitación`
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{room.title}</h1>
          {!room.isAvailable && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
              No disponible
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-terracotta text-terracotta mr-1" />
            <span className="font-medium mr-1">{room.rating}</span>
            <span className="text-muted-foreground">({room.reviews} reseñas)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{room.location}</span>
          </div>
          {room.lastModified && (
            <div className="text-sm text-muted-foreground">
              Actualizado: {format(new Date(room.lastModified), "dd/MM/yyyy", { locale: es })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RoomGallery images={room.images || [
              {
                id: 1,
                url: room.image,
                alt: room.title
              }
            ]} />

            <div className="mt-8">
              <div className="flex items-center justify-between pb-4 border-b mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {room.type} en alojamiento entero
                  </h2>
                  <p className="text-muted-foreground">
                    Máximo 2 huéspedes • 1 cama • 1 baño
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-deepblue flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">Administrador</p>
                    <p className="text-sm text-muted-foreground">
                      Anfitrión desde 2023
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg mb-4">
                  {room.description || `Disfruta de una lujosa habitación tipo ${room.type} con todas las comodidades que necesitas para una estancia perfecta.`}
                </p>
              </div>

              <div className="mb-10">
                <RoomAmenities amenities={amenities} />
              </div>

              <div className="mb-8">
                <AdditionalServices services={[
                  { id: 1, name: "Traslado desde aeropuerto", price: 25, icon: "car" },
                  { id: 2, name: "Desayuno premium", price: 15, icon: "coffee" },
                  { id: 3, name: "Tour guiado por la ciudad", price: 35, icon: "map" },
                  { id: 4, name: "Servicio de lavandería", price: 20, icon: "shirt" }
                ]} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm 
              roomId={room.id} 
              price={room.price} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetails;

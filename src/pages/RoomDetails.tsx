
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomGallery from "@/components/RoomGallery";
import BookingForm from "@/components/BookingForm";
import RoomAmenities, { sampleAmenities } from "@/components/RoomAmenities";
import AdditionalServices, { sampleServices } from "@/components/AdditionalServices";
import { Star, User, MapPin } from "lucide-react";

// Datos de muestra para la habitación
const roomData = {
  id: 1,
  title: "Suite Premium con Vista Panorámica",
  location: "Centro de la ciudad, a 5 min de la plaza principal",
  description:
    "Disfruta de una lujosa suite con vista panorámica a la ciudad. Esta espaciosa habitación cuenta con una cama king size, baño completo con bañera y ducha, y todas las comodidades que necesitas para una estancia perfecta.",
  price: 120,
  rating: 4.9,
  reviews: 124,
  host: "María González",
  hostJoined: "2019",
  maxGuests: 2,
  beds: 1,
  bathrooms: 1,
  amenities: sampleAmenities,
  services: sampleServices,
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Vista principal de la Suite Premium",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
      alt: "Baño de la habitación",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Área de descanso",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      alt: "Vista desde la ventana",
    },
  ],
};

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{roomData.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-terracotta text-terracotta mr-1" />
            <span className="font-medium mr-1">{roomData.rating}</span>
            <span className="text-muted-foreground">({roomData.reviews} reseñas)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{roomData.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RoomGallery images={roomData.images} />

            <div className="mt-8">
              <div className="flex items-center justify-between pb-4 border-b mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Habitación en alojamiento entero
                  </h2>
                  <p className="text-muted-foreground">
                    Máximo {roomData.maxGuests} huéspedes • {roomData.beds} cama •{" "}
                    {roomData.bathrooms} baño
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-deepblue flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">{roomData.host}</p>
                    <p className="text-sm text-muted-foreground">
                      Anfitrión desde {roomData.hostJoined}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg mb-4">
                  {roomData.description}
                </p>
              </div>

              <div className="mb-10">
                <RoomAmenities amenities={roomData.amenities} />
              </div>

              <div className="mb-8">
                <AdditionalServices services={roomData.services} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm roomId={roomData.id} price={roomData.price} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetails;

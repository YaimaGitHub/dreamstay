import { Navbar } from "@/components/Navbar"
import { LanguageCurrencyHeader } from "@/components/LanguageCurrencyHeader"
import { RotatingBanner } from "@/components/RotatingBanner"
import { Hero } from "@/components/Hero"
import { FeaturedRoom } from "@/components/FeaturedRoom"
import { FeaturesSection } from "@/components/FeaturesSection"
import { Footer } from "@/components/Footer"
import type { Room } from "@/types/room"

// Datos de la habitación única
const roomData: Room = {
  id: 1,
  name: "Habitación Deluxe con Vista al Mar",
  description:
    "Espaciosa habitación con hermosas vistas al océano, baño privado, WiFi gratuito y desayuno incluido. Disfruta de una experiencia inolvidable con todas las comodidades modernas en un entorno tranquilo y acogedor.",
  price: 85,
  capacity: 2,
  features: [
    "Baño privado",
    "WiFi",
    "Desayuno incluido",
    "Aire acondicionado",
    "Vista al mar",
    "TV de pantalla plana",
    "Minibar",
    "Caja fuerte",
    "Secador de pelo",
    "Artículos de aseo gratuitos",
  ],
  images: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1074",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1171",
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=1169",
    "https://images.unsplash.com/photo-1630660664869-c9d3cc676880?auto=format&fit=crop&q=80&w=1080",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=958",
    "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&q=80&w=1074",
  ],
  bookedDates: [
    new Date(2025, 4, 5),
    new Date(2025, 4, 6),
    new Date(2025, 4, 7),
    new Date(2025, 4, 15),
    new Date(2025, 4, 16),
  ],
}

const Index = () => {
  return (
    <>
      <LanguageCurrencyHeader />
      <Navbar />

      {/* Banner rotativo */}
      <RotatingBanner />

      {/* Hero */}
      <Hero room={roomData} />

      {/* Habitación destacada */}
      <FeaturedRoom room={roomData} />

      {/* Información adicional */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </>
  )
}

export default Index

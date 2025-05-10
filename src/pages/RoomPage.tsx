"use client"

import { useParams, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { RoomDetail } from "@/components/RoomDetail"
import { Button } from "@/components/ui/button"
import type { Room } from "@/types/room"
import { useTranslation } from "react-i18next"
import { LanguageCurrencyHeader } from "@/components/LanguageCurrencyHeader"

// Datos de la habitación única - Organized by categories for better management
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
    // Main room views
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1074",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1171",
    "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=1169",

    // Bathroom and details
    "https://images.unsplash.com/photo-1630660664869-c9d3cc676880?auto=format&fit=crop&q=80&w=1080",
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=958",

    // Views and surroundings
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?auto=format&fit=crop&q=80&w=1074",

    // Additional room features
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1074",
    "https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&q=80&w=1025",

    // Amenities and services
    "https://images.unsplash.com/photo-1598928506311-c5b7a0df6f12?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&q=80&w=1074",

    // New high-quality images
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1170",
  ],
  bookedDates: [
    new Date(2025, 4, 5),
    new Date(2025, 4, 6),
    new Date(2025, 4, 7),
    new Date(2025, 4, 15),
    new Date(2025, 4, 16),
  ],
}

const RoomPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Verificamos si el ID corresponde a nuestra habitación única
  const roomId = Number.parseInt(id || "0")
  const room = roomId === 1 ? roomData : null

  if (!room) {
    return (
      <>
        <LanguageCurrencyHeader />
        <Navbar />
        <div className="container py-16 text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4">{t("roomDetail.notFound")}</h1>
          <p className="mb-6">{t("roomDetail.notFoundDesc")}</p>
          <Button onClick={() => navigate("/")}>{t("roomDetail.backToHome")}</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <LanguageCurrencyHeader />
      <Navbar />
      <div className="py-4 bg-muted/30">
        <div className="container">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 transition-colors duration-200 hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:-translate-x-1"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t("roomDetail.backToRooms")}
          </Button>
        </div>
      </div>
      <div className="animate-fade-in">
        <RoomDetail room={room} />
      </div>

      {/* Footer */}
      <footer className="bg-rental-navy text-white py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-4">DreamStay</h3>
              <p className="text-sm text-gray-300">{t("footer.description")}</p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="text-lg font-semibold mb-4">{t("footer.contact")}</h3>
              <address className="text-sm text-gray-300 not-italic">
                <p className="mb-2">{t("footer.address")}</p>
                <p className="mb-2">{t("footer.city")}</p>
                <p className="mb-2">{t("footer.phone")}</p>
                <p>{t("footer.email")}</p>
              </address>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="/" className="hover:text-rental-accent transition-colors duration-200">
                    {t("navbar.home")}
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-rental-accent transition-colors duration-200">
                    {t("navbar.about")}
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-rental-accent transition-colors duration-200">
                    {t("navbar.contact")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} DreamStay. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default RoomPage

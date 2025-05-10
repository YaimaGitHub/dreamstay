"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import type { Room } from "@/types/room"

interface HeroProps {
  room: Room
}

export function Hero({ room }: HeroProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  // Get the brand name based on current language
  const getBrandName = () => {
    return i18n.language === "es" ? "La Terraza | Bendecida" : "The Terrace | Blessed"
  }

  return (
    <section className="relative bg-gradient-to-r from-rental-navy to-rental-terra text-white">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t("hero.title")}</h1>
          <p className="text-lg mb-6">{t("hero.subtitle")}</p>
          <Button
            size="lg"
            className="bg-white text-rental-terra hover:bg-rental-light"
            onClick={() => navigate(`/room/${room.id}`)}
          >
            {t("hero.exploreRooms")}
          </Button>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full text-background fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.4,56.44Z"></path>
        </svg>
      </div>
    </section>
  )
}

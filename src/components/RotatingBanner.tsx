"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { useTranslation } from "react-i18next"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Define image paths from local assets folder
// These images should be stored in the public/images/banner folder
const bannerImages = [
  "/images/banner/room-view-1.jpg",
  "/images/banner/room-view-2.jpg",
  "/images/banner/ocean-view-1.jpg",
  "/images/banner/amenities-1.jpg",
  "/images/banner/breakfast-1.jpg",
  "/images/banner/beach-1.jpg",
  "/images/banner/pool-1.jpg",
  "/images/banner/sunset-1.jpg",
]

export function RotatingBanner() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressTimerRef = useRef<number | null>(null)

  // Get the brand name based on current language
  const getBrandName = () => {
    return i18n.language === "es" ? "La Terraza | Bendecida" : "The Terrace | Blessed"
  }

  // Configure autoplay with longer duration for better viewing
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 6000, // 6 seconds per slide
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      }),
    [],
  )

  const onSelect = useCallback(() => {
    if (!api) return

    // Update active index when slide changes
    const index = api.selectedScrollSnap()
    setActiveIndex(index)

    // Reset and start progress animation
    if (progressRef.current) {
      progressRef.current.style.width = "0%"
      progressRef.current.style.transition = "none"

      // Force reflow to restart animation
      void progressRef.current.offsetWidth

      progressRef.current.style.transition = "width 6000ms linear"
      progressRef.current.style.width = "100%"
    }
  }, [api])

  useEffect(() => {
    if (!api) return

    api.on("select", onSelect)

    // Initial progress animation
    if (progressRef.current) {
      progressRef.current.style.width = "0%"
      progressRef.current.style.transition = "width 6000ms linear"
      progressRef.current.style.width = "100%"
    }

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  // Pause/resume autoplay when hovering
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    setIsPaused(true)
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "paused"
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setIsPaused(false)
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "running"
    }
    if (parallaxRef.current) {
      parallaxRef.current.style.transform = "translate(0px, 0px) scale(1)"
    }
  }, [])

  // Parallax effect on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!parallaxRef.current || isPaused) return

      const { clientX, clientY } = e
      const { width, height } = parallaxRef.current.getBoundingClientRect()

      const xPos = (clientX / width - 0.5) * 20
      const yPos = (clientY / height - 0.5) * 20

      parallaxRef.current.style.transform = `translate(${xPos}px, ${yPos}px) scale(1.05)`
    },
    [isPaused],
  )

  return (
    <div className="w-full max-w-7xl mx-auto my-8 overflow-hidden">
      <div className="relative">
        <Carousel
          opts={{
            loop: true,
            align: "center",
          }}
          plugins={[autoplayPlugin]}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="h-[500px]">
            {bannerImages.map((imageUrl, index) => (
              <CarouselItem
                key={index}
                className="overflow-hidden rounded-lg"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <div className="relative h-full w-full overflow-hidden group">
                  {/* Parallax image container with transition effects */}
                  <div
                    ref={index === activeIndex ? parallaxRef : null}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                      activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
                    }`}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      willChange: "transform, opacity",
                    }}
                  />

                  {/* Gradient overlay with animated opacity */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-1000 ${
                      activeIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Content container with staggered animations */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div className="max-w-xl">
                      <h2
                        className={`text-3xl md:text-4xl font-bold text-white transition-all duration-1000 ${
                          activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                      >
                        {getBrandName()} - {t("banner.subtitle")}
                      </h2>

                      <p
                        className={`text-lg md:text-xl text-white/90 mt-3 transition-all duration-1000 delay-100 ${
                          activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                      >
                        {t("banner.subtitle")}
                      </p>

                      <Button
                        onClick={() => navigate("/room/1")}
                        className={`mt-5 bg-rental-terra hover:bg-rental-accent text-white transition-all duration-1000 delay-200 group ${
                          activeIndex === index ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                      >
                        {t("hero.exploreRooms")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced indicators with animations */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-3 rounded-full transition-all duration-500 ${
                  activeIndex === index ? "bg-white w-8" : "bg-white/50 w-3 hover:bg-white/70"
                }`}
                aria-label={t("banner.goToSlide", { number: index + 1 })}
              />
            ))}
          </div>

          {/* Progress bar for current slide */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              ref={progressRef}
              className="h-full bg-white/70 w-0"
              style={{
                transition: "width 6000ms linear",
                willChange: "width",
              }}
            />
          </div>
        </Carousel>

        {/* Pause/Play indicator */}
        {isPaused && (
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {t("banner.paused")}
          </div>
        )}
      </div>
    </div>
  )
}

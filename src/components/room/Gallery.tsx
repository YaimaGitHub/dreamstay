"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Room } from "@/types/room"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Play, Images, Download, ChevronLeft, ChevronRight, Maximize2, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"

interface GalleryProps {
  room: Room
}

// Define local image paths organized by category
const roomImages = {
  main: [
    "/images/room/main/room-view-1.jpg",
    "/images/room/main/room-view-2.jpg",
    "/images/room/main/room-view-3.jpg",
    "/images/room/main/room-view-4.jpg",
  ],
  bathroom: [
    "/images/room/bathroom/bathroom-1.png",
    "/images/room/bathroom/bathroom-2.png",
    "/images/room/bathroom/bathroom-3.jpg",
  ],
  views: [
    "/images/room/views/ocean-view-1.jpg",
    "/images/room/views/ocean-view-2.jpg",
    "/images/room/views/balcony-1.jpg",
  ],
  amenities: [
    "/images/room/amenities/breakfast-1.jpg",
    "/images/room/amenities/minibar-1.jpg",
    "/images/room/amenities/wifi-1.jpg",
    "/images/room/amenities/tv-1.jpg",
  ],
  surroundings: [
    "/images/room/surroundings/beach-1.jpg",
    "/images/room/surroundings/pool-1.jpg",
    "/images/room/surroundings/restaurant-1.jpg",
    "/images/room/surroundings/sunset-1.jpg",
  ],
}

// Flatten all images for the main carousel
const allImages = Object.values(roomImages).flat()

export function Gallery({ room }: GalleryProps) {
  const { t } = useTranslation()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [mainApi, setMainApi] = useState<CarouselApi | null>(null)
  const [categoryApi, setCategoryApi] = useState<CarouselApi | null>(null)
  const [loadedImages, setLoadedImages] = useState<boolean[]>(Array(allImages.length).fill(false))
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [showImageInfo, setShowImageInfo] = useState(false)
  const isMobile = useIsMobile()

  // Preload the first few images for better user experience
  useEffect(() => {
    const preloadCount = 4
    const imagesToPreload = allImages.slice(0, preloadCount)

    imagesToPreload.forEach((src, index) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setLoadedImages((prev) => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }
    })
  }, [])

  // Load remaining images after initial render
  useEffect(() => {
    let isMounted = true

    const loadRemainingImages = async () => {
      const preloadCount = 4
      const remainingImages = allImages.slice(preloadCount)

      for (let i = 0; i < remainingImages.length; i++) {
        if (!isMounted) break

        const img = new Image()
        img.src = remainingImages[i]

        await new Promise<void>((resolve) => {
          img.onload = () => {
            if (isMounted) {
              setLoadedImages((prev) => {
                const newState = [...prev]
                newState[i + preloadCount] = true
                return newState
              })
            }
            resolve()
          }
          img.onerror = () => resolve()
        })
      }
    }

    loadRemainingImages()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleFullscreen = useCallback(
    (index: number) => {
      setSelectedImageIndex(index)
      setShowFullscreen(!showFullscreen)
    },
    [showFullscreen],
  )

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setSelectedImageIndex(index)
      mainApi?.scrollTo(index)
    },
    [mainApi],
  )

  const handleMainImageChange = useCallback((index: number) => {
    setSelectedImageIndex(index)
  }, [])

  const downloadImage = useCallback(
    (imageUrl: string, imageName: string) => {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `${room.name}-${imageName}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    [room.name],
  )

  // Get current category images
  const currentCategoryImages = useMemo(() => {
    if (activeCategory === "all") return allImages
    return roomImages[activeCategory as keyof typeof roomImages] || []
  }, [activeCategory])

  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullscreen) return

      if (e.key === "Escape") {
        setShowFullscreen(false)
      } else if (e.key === "ArrowRight") {
        mainApi?.scrollNext()
      } else if (e.key === "ArrowLeft") {
        mainApi?.scrollPrev()
      } else if (e.key === "i") {
        setShowImageInfo(!showImageInfo)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showFullscreen, mainApi, showImageInfo])

  // Get image category and index info
  const getImageInfo = (imagePath: string) => {
    for (const [category, images] of Object.entries(roomImages)) {
      const index = images.indexOf(imagePath)
      if (index !== -1) {
        return { category, index: index + 1, total: images.length }
      }
    }
    return { category: "unknown", index: 0, total: 0 }
  }

  return (
    <div className="space-y-4">
      {/* Main Image Carousel with Fullscreen Overlay */}
      <div className="relative">
        <Carousel
          className={cn(
            "transition-all duration-500",
            showFullscreen ? "fixed inset-0 z-50 flex items-center justify-center bg-background/95 rounded-none" : "",
          )}
          setApi={setMainApi}
          opts={{
            align: "center",
            loop: true,
            startIndex: selectedImageIndex,
          }}
          onSelect={() => {
            if (mainApi) {
              handleMainImageChange(mainApi.selectedScrollSnap())
            }
          }}
        >
          <CarouselContent className="aspect-[16/9] md:aspect-[16/9] sm:aspect-[4/3]">
            {allImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="overflow-hidden rounded-lg"
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {loadedImages[index] || index < 4 ? (
                  <div className="relative h-full w-full overflow-hidden group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${room.name} - imagen ${index + 1}`}
                      className={cn(
                        "h-full w-full object-cover transition-all duration-700",
                        showFullscreen ? "object-contain max-h-[90vh]" : "group-hover:scale-105",
                        hoveredImage === index && !showFullscreen ? "scale-[1.02]" : "",
                      )}
                      onClick={() => toggleFullscreen(index)}
                      loading={index < 4 ? "eager" : "lazy"}
                    />

                    {/* Hover overlay with animation */}
                    {!showFullscreen && (
                      <div
                        className={cn(
                          "absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 flex items-center justify-center",
                          hoveredImage === index ? "opacity-100" : "",
                        )}
                        onClick={() => toggleFullscreen(index)}
                      >
                        <Maximize2
                          className={cn(
                            "h-12 w-12 text-white opacity-0 transition-all duration-300 transform scale-75",
                            hoveredImage === index ? "opacity-100 scale-100" : "",
                          )}
                        />
                      </div>
                    )}

                    {/* Image info in fullscreen mode */}
                    {showFullscreen && showImageInfo && (
                      <div className="absolute bottom-16 left-0 right-0 bg-black/60 text-white p-4 text-center">
                        <p className="text-lg font-medium">{getImageInfo(image).category.toUpperCase()}</p>
                        <p className="text-sm">
                          {getImageInfo(image).index} / {getImageInfo(image).total}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted animate-pulse">
                    <Images className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced navigation arrows - more visible */}
          {!showFullscreen ? (
            <>
              <CarouselPrevious className="left-2 md:left-4 bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm border-0 shadow-lg h-10 w-10 sm:h-12 sm:w-12 visible opacity-80">
                <ChevronLeft className="h-6 w-6 text-white" />
              </CarouselPrevious>
              <CarouselNext className="right-2 md:right-4 bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm border-0 shadow-lg h-10 w-10 sm:h-12 sm:w-12 visible opacity-80">
                <ChevronRight className="h-6 w-6 text-white" />
              </CarouselNext>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full z-50 transition-all duration-200 hover:rotate-90"
              >
                <X className="h-6 w-6 text-white" />
                <span className="sr-only">Close fullscreen</span>
              </button>
              <CarouselPrevious className="left-4 bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm border-0 shadow-lg h-12 w-12 visible opacity-80">
                <ChevronLeft className="h-6 w-6 text-white" />
              </CarouselPrevious>
              <CarouselNext className="right-4 bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm border-0 shadow-lg h-12 w-12 visible opacity-80">
                <ChevronRight className="h-6 w-6 text-white" />
              </CarouselNext>
            </>
          )}
        </Carousel>

        {/* Controls overlay with download button added */}
        {!showFullscreen && (
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              onClick={() => downloadImage(allImages[selectedImageIndex], `imagen-${selectedImageIndex + 1}`)}
              className="bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full transition-colors duration-200"
              size="icon"
              variant="ghost"
              title="Descargar imagen"
            >
              <Download className="h-5 w-5 text-white drop-shadow-md" />
            </Button>
            <Button
              onClick={() => toggleFullscreen(selectedImageIndex)}
              className="bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full transition-colors duration-200"
              size="icon"
              variant="ghost"
              title="Pantalla completa"
            >
              <Maximize2 className="h-5 w-5 text-white drop-shadow-md" />
            </Button>
            <Button
              className="bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full transition-colors duration-200 animate-pulse"
              size="icon"
              variant="ghost"
              title="Ver tour virtual"
            >
              <Play className="h-5 w-5 text-white drop-shadow-md" />
            </Button>
          </div>
        )}

        {/* Fullscreen controls */}
        {showFullscreen && (
          <div className="absolute top-4 left-4 flex gap-2 z-50">
            <Button
              onClick={() => downloadImage(allImages[selectedImageIndex], `imagen-${selectedImageIndex + 1}`)}
              className="bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full"
              size="icon"
              variant="ghost"
              title="Descargar imagen"
            >
              <Download className="h-5 w-5 text-white" />
            </Button>
            <Button
              onClick={() => setShowImageInfo(!showImageInfo)}
              className={`bg-foreground/50 hover:bg-foreground/70 backdrop-blur-sm p-2 rounded-full ${
                showImageInfo ? "bg-foreground/70" : ""
              }`}
              size="icon"
              variant="ghost"
              title="Mostrar información"
            >
              <Info className="h-5 w-5 text-white" />
            </Button>
          </div>
        )}

        {/* Image counter in fullscreen mode */}
        {showFullscreen && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-foreground/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Category tabs for filtering images */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Galería de imágenes</h3>
          <span className="text-xs text-muted-foreground">{allImages.length} fotos</span>
        </div>

        <TabsList className="w-full h-auto flex flex-wrap justify-start bg-transparent space-x-1 space-y-1 p-0">
          <TabsTrigger
            value="all"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Todas ({allImages.length})
          </TabsTrigger>
          <TabsTrigger
            value="main"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Habitación ({roomImages.main.length})
          </TabsTrigger>
          <TabsTrigger
            value="bathroom"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Baño ({roomImages.bathroom.length})
          </TabsTrigger>
          <TabsTrigger
            value="views"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Vistas ({roomImages.views.length})
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Comodidades ({roomImages.amenities.length})
          </TabsTrigger>
          <TabsTrigger
            value="surroundings"
            className="px-3 py-1 h-auto data-[state=active]:bg-rental-terra data-[state=active]:text-white"
          >
            Alrededores ({roomImages.surroundings.length})
          </TabsTrigger>
        </TabsList>

        {/* Thumbnails grid for each category */}
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {allImages.map((image, index) => (
              <ThumbnailImage
                key={index}
                image={image}
                index={index}
                selectedImageIndex={selectedImageIndex}
                handleThumbnailClick={handleThumbnailClick}
                loadedImages={loadedImages}
                room={room}
              />
            ))}
          </div>
        </TabsContent>

        {Object.entries(roomImages).map(([category, images]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {images.map((image, categoryIndex) => {
                const globalIndex = allImages.indexOf(image)
                return (
                  <ThumbnailImage
                    key={categoryIndex}
                    image={image}
                    index={globalIndex}
                    selectedImageIndex={selectedImageIndex}
                    handleThumbnailClick={handleThumbnailClick}
                    loadedImages={loadedImages}
                    room={room}
                  />
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Thumbnail component to reduce repetition
interface ThumbnailImageProps {
  image: string
  index: number
  selectedImageIndex: number
  handleThumbnailClick: (index: number) => void
  loadedImages: boolean[]
  room: Room
}

function ThumbnailImage({
  image,
  index,
  selectedImageIndex,
  handleThumbnailClick,
  loadedImages,
  room,
}: ThumbnailImageProps) {
  return (
    <div
      className={cn(
        "aspect-[4/3] overflow-hidden rounded-md cursor-pointer border-2 transition-all duration-300 hover:opacity-90",
        index === selectedImageIndex
          ? "border-rental-terra scale-[0.98] shadow-md"
          : "border-transparent hover:border-rental-light",
      )}
      onClick={() => handleThumbnailClick(index)}
    >
      {loadedImages[index] || index < 10 ? (
        <img
          src={image || "/placeholder.svg"}
          alt={`${room.name} - miniatura ${index + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted">
          <Images className="h-4 w-4 text-muted-foreground/50" />
        </div>
      )}
    </div>
  )
}

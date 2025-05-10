
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";

interface GalleryProps {
  images: Array<{
    id: number;
    url: string;
    alt: string;
  }>;
}

const RoomGallery = ({ images }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2 md:mb-4">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover"
        />
        
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white"
          onClick={() => setShowFullscreen(true)}
        >
          <Maximize className="h-5 w-5" />
        </Button>

        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white ml-2 pointer-events-auto"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 hover:bg-black/70 text-white mr-2 pointer-events-auto"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`aspect-[4/3] rounded-md overflow-hidden cursor-pointer ${
              index === currentIndex ? "ring-2 ring-terracotta" : "opacity-70"
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-black/20"
            onClick={() => setShowFullscreen(false)}
          >
            Cerrar
          </Button>

          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 text-white ml-4 pointer-events-auto"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 text-white mr-4 pointer-events-auto"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGallery;

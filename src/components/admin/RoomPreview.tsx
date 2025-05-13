
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, RulerIcon, StarIcon, TagIcon } from "lucide-react"
import type { Room } from "@/types/room"

interface RoomPreviewProps {
  room: Room
}

const RoomPreview = ({ room }: RoomPreviewProps) => {
  return (
    <div className="space-y-6">
      {/* Galería de imágenes */}
      <Carousel className="w-full">
        <CarouselContent>
          {room.images && room.images.length > 0 ? (
            room.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl aspect-[16/9]">
                    <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
                  </div>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="p-1">
                <div className="overflow-hidden rounded-xl aspect-[16/9]">
                  <img src={room.image || "/placeholder.svg"} alt={room.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{room.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {room.location}
                    {room.province && `, ${room.province}`}
                  </CardDescription>
                </div>
                <Badge variant={room.available !== false ? "default" : "destructive"} className={room.available !== false ? "bg-green-500 hover:bg-green-600" : ""}>
                  {room.available !== false ? "Disponible" : "No disponible"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center text-sm">
                  <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>
                    {room.rating} ({room.reviews} reseñas)
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <TagIcon className="h-4 w-4 mr-1" />
                  <span>{room.type}</span>
                </div>
                <div className="flex items-center text-sm">
                  <RulerIcon className="h-4 w-4 mr-1" />
                  <span>{room.area} m²</span>
                </div>
              </div>

              <h3 className="font-medium mb-2">Descripción</h3>
              <p className="text-muted-foreground mb-4">{room.description}</p>

              <h3 className="font-medium mb-2">Características</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>

              {room.reservedDates && room.reservedDates.length > 0 && (
                <>
                  <h3 className="font-medium mb-2">Fechas reservadas</h3>
                  <div className="space-y-2 mb-4">
                    {room.reservedDates.map((date, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>
                          {format(new Date(date.start), "dd 'de' MMMM 'de' yyyy", { locale: es })} -{" "}
                          {format(new Date(date.end), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Precio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${room.price}</div>
              <p className="text-muted-foreground">por noche</p>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                {room.lastUpdated && (
                  <p>Última actualización: {format(new Date(room.lastUpdated), "dd/MM/yyyy", { locale: es })}</p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RoomPreview

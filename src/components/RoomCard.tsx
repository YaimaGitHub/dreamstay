import { Link } from "react-router-dom"
import type { Room } from "@/types/room"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const { t } = useTranslation()
  const { formatPriceWithIcon } = useCurrency()

  return (
    <Link to={`/room/${room.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-[16/10] relative overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold line-clamp-1">{room.name}</h3>
            <span className="text-lg font-bold text-rental-terra flex items-center">
              {formatPriceWithIcon(room.price)}
              <span className="text-sm font-normal ml-1">/{t("rooms.perNight")}</span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <p className="text-muted-foreground text-sm line-clamp-2">{room.description}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 gap-2 flex flex-wrap">
          <Badge variant="outline" className="bg-rental-light">
            {room.capacity} {room.capacity === 1 ? t("rooms.guest") : t("rooms.guests")}
          </Badge>
          {room.features.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-rental-light">
              {feature}
            </Badge>
          ))}
          {room.features.length > 2 && (
            <Badge variant="outline" className="bg-rental-light">
              +{room.features.length - 2} {t("rooms.more")}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

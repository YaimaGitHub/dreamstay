import type { Room } from "@/types/room"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { ChefHat, Utensils } from "lucide-react"

interface RoomInfoProps {
  room: Room
}

export function RoomInfo({ room }: RoomInfoProps) {
  const { t } = useTranslation()

  // Group features by category
  const gastronomicFeatures = room.features.filter(
    (feature) =>
      feature.toLowerCase().includes("desayuno") ||
      feature.toLowerCase().includes("comida") ||
      feature.toLowerCase().includes("restaurante") ||
      feature.toLowerCase().includes("minibar") ||
      feature.toLowerCase().includes("café") ||
      feature.toLowerCase().includes("tea") ||
      feature.toLowerCase().includes("cocina"),
  )

  const otherFeatures = room.features.filter((feature) => !gastronomicFeatures.includes(feature))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="text-muted-foreground">
          {t("rooms.capacity")}: {room.capacity} {room.capacity === 1 ? t("rooms.guest") : t("rooms.guests")}
        </p>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-2">{t("roomDetail.description")}</h2>
        <p className="text-foreground">{room.description}</p>
      </div>

      {gastronomicFeatures.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-rental-terra" />
            {t("roomDetail.gastronomic")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {gastronomicFeatures.map((feature, index) => (
              <Badge key={index} variant="outline" className="bg-rental-light py-1 px-3 flex items-center gap-1">
                <Utensils className="h-3 w-3" />
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">{t("roomDetail.features")}</h2>
        <div className="flex flex-wrap gap-2">
          {otherFeatures.map((feature, index) => (
            <Badge key={index} variant="outline" className="bg-rental-light py-1 px-3">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

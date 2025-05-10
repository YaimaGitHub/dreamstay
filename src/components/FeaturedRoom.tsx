import { RoomCard } from "@/components/RoomCard"
import type { Room } from "@/types/room"
import { useTranslation } from "react-i18next"

interface FeaturedRoomProps {
  room: Room
}

export function FeaturedRoom({ room }: FeaturedRoomProps) {
  const { t } = useTranslation()

  return (
    <section className="container py-12">
      <h2 className="text-2xl font-bold mb-6">{t("rooms.title")}</h2>
      <div className="max-w-3xl mx-auto">
        <RoomCard room={room} />
      </div>
    </section>
  )
}

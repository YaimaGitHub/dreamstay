import type { Room } from "@/types/room"
import { useFormContext } from "react-hook-form"
import type { z } from "zod"
import type { bookingSchema } from "./bookingSchema"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

type FormValues = z.infer<typeof bookingSchema>

interface PriceSummaryProps {
  room: Room
  nightsCount: number
  totalPrice: number
}

export function PriceSummary({ room, nightsCount, totalPrice }: PriceSummaryProps) {
  const { t } = useTranslation()
  const { formatPrice, formatPriceWithIcon } = useCurrency()
  const { watch } = useFormContext<FormValues>()
  const paymentMethod = watch("paymentMethod")

  return (
    <div className="rounded-md border p-3 bg-rental-light">
      <p className="text-sm font-medium">{t("booking.summary")}:</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm">
          {nightsCount} {t("booking.nights")} {formatPrice(room.price)}
        </p>
        <p className="text-sm">{formatPriceWithIcon(room.price * nightsCount)}</p>
      </div>

      {paymentMethod === "transfer" && (
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm">{t("booking.surcharge")}</p>
          <p className="text-sm">{formatPriceWithIcon(room.price * nightsCount * 0.15)}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-2 pt-2 border-t">
        <p className="text-sm font-bold">{t("booking.total")}</p>
        <p className="text-sm font-bold">{formatPriceWithIcon(totalPrice)}</p>
      </div>
    </div>
  )
}

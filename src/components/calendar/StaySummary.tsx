import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/CurrencyContext"

interface StaySummaryProps {
  selectedRange: {
    from: Date | undefined
    to: Date | undefined
  }
  totalNights: number
  totalPrice: number
}

export function StaySummary({ selectedRange, totalNights, totalPrice }: StaySummaryProps) {
  const { t } = useTranslation()
  const { formatPriceWithIcon } = useCurrency()

  if (!selectedRange.from || !selectedRange.to) return null

  return (
    <div className="rounded-md border p-3 bg-rental-light">
      <p className="text-sm font-medium">{t("calendar.selectedStay")}:</p>
      <p className="text-sm">
        {t("calendar.arrival")}: {format(selectedRange.from, "d 'de' MMMM, yyyy", { locale: es })}
      </p>
      <p className="text-sm">
        {t("calendar.departure")}: {format(selectedRange.to, "d 'de' MMMM, yyyy", { locale: es })}
      </p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm font-medium">
          {totalNights} {totalNights === 1 ? t("calendar.night") : t("calendar.nights")}
        </p>
        <p className="text-sm font-bold">
          {t("calendar.total")}: {formatPriceWithIcon(totalPrice)}
        </p>
      </div>
    </div>
  )
}

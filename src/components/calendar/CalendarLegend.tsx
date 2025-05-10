import { useTranslation } from "react-i18next"

export function CalendarLegend() {
  const { t } = useTranslation()

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between border-t pt-4">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="h-4 w-4 rounded-full bg-rental-terra"></span>
        <span className="text-sm">{t("calendar.available")}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full bg-muted"></span>
        <span className="text-sm">{t("calendar.occupied")}</span>
      </div>
    </div>
  )
}

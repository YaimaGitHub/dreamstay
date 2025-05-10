import { Check, X, LockOpen } from "lucide-react"
import { useTranslation } from "react-i18next"

interface AvailabilityStatusProps {
  isAvailable: boolean | null
}

export function AvailabilityStatus({ isAvailable }: AvailabilityStatusProps) {
  const { t } = useTranslation()

  if (isAvailable === null) return null

  return (
    <div
      className={`rounded-md p-3 ${isAvailable ? "bg-green-50 border-green-200 border" : "bg-red-50 border-red-200 border"}`}
    >
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <>
            <Check className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">{t("roomDetail.available")}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <LockOpen className="h-3 w-3" />
                {t("roomDetail.bookingEnabled")}
              </p>
            </div>
          </>
        ) : (
          <>
            <X className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800 font-medium">{t("roomDetail.notAvailable")}</p>
          </>
        )}
      </div>
    </div>
  )
}

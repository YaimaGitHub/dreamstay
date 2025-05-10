"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Baby } from "lucide-react"
import { useTranslation } from "react-i18next"

interface GuestInputsProps {
  adults: number
  children: number
  babies: number
  setAdults: (value: number) => void
  setChildren: (value: number) => void
  setBabies: (value: number) => void
}

export function GuestInputs({ adults, children, babies, setAdults, setChildren, setBabies }: GuestInputsProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <Label htmlFor="adults">{t("booking.adults")}</Label>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <Input
            id="adults"
            type="number"
            min={1}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="children">{t("booking.children")}</Label>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <Input
            id="children"
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number.parseInt(e.target.value) || 0))}
            className="w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="babies">{t("booking.babies")}</Label>
        <div className="flex items-center gap-2">
          <Baby className="h-4 w-4" />
          <Input
            id="babies"
            type="number"
            min={0}
            value={babies}
            onChange={(e) => setBabies(Math.max(0, Number.parseInt(e.target.value) || 0))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

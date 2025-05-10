import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Users, Baby } from "lucide-react"
import type { Control } from "react-hook-form"
import type { z } from "zod"
import type { bookingSchema } from "./bookingSchema"
import { useTranslation } from "react-i18next"

type FormValues = z.infer<typeof bookingSchema>

interface GuestFieldsProps {
  control: Control<FormValues>
}

export function GuestFields({ control }: GuestFieldsProps) {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="text-lg font-medium pt-4">{t("booking.guests")}</h3>
      <div className="space-y-4 rounded-lg border p-4">
        <FormField
          control={control}
          name="adults"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <FormLabel className="text-base mb-0">{t("booking.adults")}</FormLabel>
                </div>
                <FormDescription>{t("booking.adultsDesc")}</FormDescription>
              </div>
              <FormControl>
                <Input type="number" className="w-16 text-center" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="children"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <FormLabel className="text-base mb-0">{t("booking.children")}</FormLabel>
                </div>
                <FormDescription>{t("booking.childrenDesc")}</FormDescription>
              </div>
              <FormControl>
                <Input type="number" className="w-16 text-center" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="babies"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  <FormLabel className="text-base mb-0">{t("booking.babies")}</FormLabel>
                </div>
                <FormDescription>{t("booking.babiesDesc")}</FormDescription>
              </div>
              <FormControl>
                <Input type="number" className="w-16 text-center" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

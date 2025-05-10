"use client"

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import type { Control } from "react-hook-form"
import type { z } from "zod"
import type { bookingSchema } from "./bookingSchema"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"
import { useTranslation } from "react-i18next"

type FormValues = z.infer<typeof bookingSchema>

interface TravelDetailsFieldsProps {
  control: Control<FormValues>
}

export function TravelDetailsFields({ control }: TravelDetailsFieldsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium pt-4">{t("booking.travelDetails")}</h3>

      <FormField
        control={control}
        name="arrivalDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t("booking.countryArrivalDate")}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? (
                      format(field.value, "d 'de' MMMM, yyyy", { locale: es })
                    ) : (
                      <span>{t("calendar.selectDate")}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={es}
                  className="rounded-md border bg-white p-2 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormDescription>{t("booking.arrivalDateDescription")}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="needsPickup"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{t("booking.pickupService")}</FormLabel>
              <FormDescription>{t("booking.needsAirportPickup")}</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {control._formValues.needsPickup && (
        <FormField
          control={control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("booking.flightNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("booking.flightNumberExample")} {...field} />
              </FormControl>
              <FormDescription>{t("booking.flightNumberDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("booking.additionalComments")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("booking.specialRequestsPlaceholder")} className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

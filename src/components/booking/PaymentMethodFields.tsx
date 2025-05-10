"use client"

import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Banknote } from "lucide-react"
import type { Control } from "react-hook-form"
import type { z } from "zod"
import type { bookingSchema } from "./bookingSchema"
import { useTranslation } from "react-i18next"

type FormValues = z.infer<typeof bookingSchema>

interface PaymentMethodFieldsProps {
  control: Control<FormValues>
}

export function PaymentMethodFields({ control }: PaymentMethodFieldsProps) {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="text-lg font-medium pt-4">{t("booking.payment")}</h3>
      <FormField
        control={control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>{t("booking.choosePayment")}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-3">
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="cash" />
                  </FormControl>
                  <FormLabel className="font-normal flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    {t("booking.cash")}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="transfer" />
                  </FormControl>
                  <div>
                    <FormLabel className="font-normal flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {t("booking.transfer")}
                    </FormLabel>
                    <FormDescription>{t("booking.transferSurcharge")}</FormDescription>
                  </div>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

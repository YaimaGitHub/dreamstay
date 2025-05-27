"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import type { RoomFormValues } from "./RoomFormSchema"

const HostInfoFields = () => {
  const form = useFormContext<RoomFormValues>()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Información del Anfitrión</h3>

      {/* Campo WhatsApp del Anfitrión */}
      <FormField
        control={form.control}
        name="whatsappNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de WhatsApp del Anfitrión</FormLabel>
            <FormControl>
              <Input
                placeholder="+1234567890"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  console.log("📱 WhatsApp actualizado:", e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default HostInfoFields

"use client"

import type React from "react"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { getInitials } from "@/utils/host-manager"

const HostInfoFields = () => {
  const form = useFormContext()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Obtener valores actuales del formulario para mostrar iniciales
  const hostName = form.watch("hostName") || "Anfitrión"
  const hostPhoto = form.watch("hostPhoto") || ""

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        form.setError("hostPhoto", {
          type: "manual",
          message: "La imagen no debe superar los 5MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
        form.setValue("hostPhoto", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Anfitrión</CardTitle>
        <CardDescription>
          Configura la información del anfitrión para esta habitación específica. Cada habitación puede tener su propio
          anfitrión personalizado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del anfitrión</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del anfitrión" {...field} />
                  </FormControl>
                  <FormDescription>Nombre completo del anfitrión de esta propiedad</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostSince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anfitrión desde (año)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2020"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Año desde el que esta persona es anfitrión</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="hostPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto del anfitrión</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                      <Input type="hidden" {...field} />
                      <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={previewImage || hostPhoto} alt={hostName} />
                          <AvatarFallback className="text-lg bg-terracotta/20">{getInitials(hostName)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-muted-foreground">
                          <p>Vista previa de la foto del anfitrión</p>
                          <p>Tamaño recomendado: 200x200px</p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Sube una foto del anfitrión (máximo 5MB). Si no subes ninguna, se mostrarán las iniciales.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HostInfoFields

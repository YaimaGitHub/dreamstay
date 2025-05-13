"use client"

import type React from "react"

import { useState } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import type { RoomFormValues } from "./RoomFormSchema"

const HostInfoFields = () => {
  const form = useFormContext<RoomFormValues>()
  const currentYear = new Date().getFullYear()
  const [previewImage, setPreviewImage] = useState<string | null>(form.getValues("hostPhoto") || null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      form.setError("hostPhoto", {
        type: "manual",
        message: "El archivo debe ser una imagen",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError("hostPhoto", {
        type: "manual",
        message: "La imagen no debe superar los 5MB",
      })
      return
    }

    // Crear URL para previsualización
    const imageUrl = URL.createObjectURL(file)
    setPreviewImage(imageUrl)

    // Convertir a Base64 para almacenamiento
    const reader = new FileReader()
    reader.onloadend = () => {
      form.setValue("hostPhoto", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    form.setValue("hostPhoto", "")
    setPreviewImage(null)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="text-lg font-medium">Información del Anfitrión</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hostName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Anfitrión</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del anfitrión" {...field} />
              </FormControl>
              <FormDescription>Nombre completo del anfitrión</FormDescription>
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
                  placeholder={`2000-${currentYear}`}
                  min={2000}
                  max={currentYear}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : Number(e.target.value)
                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormDescription>Año en que comenzó como anfitrión</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hostPhoto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto del anfitrión</FormLabel>
            <div className="flex flex-col space-y-4">
              {previewImage ? (
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-2 border-muted">
                    <AvatarImage src={previewImage || "/placeholder.svg"} alt="Vista previa" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm" onClick={clearImage}>
                    <X className="h-4 w-4 mr-2" /> Eliminar foto
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground text-center">
                      <label htmlFor="hostPhotoUpload" className="cursor-pointer text-terracotta hover:underline">
                        Haz clic para subir
                      </label>{" "}
                      o arrastra y suelta
                      <p className="text-xs">PNG, JPG o WEBP (máx. 5MB)</p>
                    </div>
                  </div>
                  <input
                    id="hostPhotoUpload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              <input type="hidden" {...field} />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default HostInfoFields

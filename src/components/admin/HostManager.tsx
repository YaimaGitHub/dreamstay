"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { ImagePlus, User, Trash } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

interface Host {
  name: string
  bio: string
  photo: string
  experience?: number
  contact?: string
}

interface HostManagerProps {
  host: Host | undefined
  setHost: React.Dispatch<React.SetStateAction<Host | undefined>>
}

const HostManager = ({ host, setHost }: HostManagerProps) => {
  const form = useFormContext()
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo seleccionado no es una imagen válida")
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Image = e.target?.result as string
      setHost((prevHost) => ({
        ...prevHost!,
        photo: base64Image,
      }))
      toast.success("Foto del anfitrión cargada correctamente")
      setIsUploading(false)
    }

    reader.onerror = () => {
      toast.error("Error al leer el archivo")
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const removePhoto = () => {
    setHost((prevHost) => ({
      ...prevHost!,
      photo: "",
    }))
    toast.success("Foto del anfitrión eliminada")
  }

  const handleInputChange = (field: keyof Host, value: string | number) => {
    setHost((prevHost) => ({
      ...prevHost!,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información del Anfitrión</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="hostName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Anfitrión</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: María Rodríguez"
                    value={host?.name || ""}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value)
                      field.onChange(e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>Nombre completo del anfitrión</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Años de Experiencia</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Ej: 5"
                    value={host?.experience || ""}
                    onChange={(e) => {
                      handleInputChange("experience", Number(e.target.value))
                      field.onChange(Number(e.target.value))
                    }}
                  />
                </FormControl>
                <FormDescription>Experiencia como anfitrión (en años)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hostContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Información de Contacto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: maria@ejemplo.com"
                    value={host?.contact || ""}
                    onChange={(e) => {
                      handleInputChange("contact", e.target.value)
                      field.onChange(e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>Email o teléfono de contacto (opcional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label>Foto del Anfitrión</Label>
            <div className="mt-2 flex flex-col items-center space-y-4">
              {host?.photo ? (
                <div className="relative group">
                  <img
                    src={host.photo || "/placeholder.svg"}
                    alt={`Foto de ${host.name || "anfitrión"}`}
                    className="w-32 h-32 object-cover rounded-full border-2 border-terracotta"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                id="host-photo-upload"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => document.getElementById("host-photo-upload")?.click()}
                disabled={isUploading}
              >
                <ImagePlus className="h-4 w-4" />
                {isUploading ? "Subiendo..." : "Subir foto"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="hostBio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografía</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Breve descripción sobre el anfitrión..."
                className="resize-none"
                rows={4}
                value={host?.bio || ""}
                onChange={(e) => {
                  handleInputChange("bio", e.target.value)
                  field.onChange(e.target.value)
                }}
              />
            </FormControl>
            <FormDescription>Información sobre el anfitrión que se mostrará a los huéspedes</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default HostManager

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Import refactored components
import BasicInfoFields from "@/components/admin/BasicInfoFields"
import FeatureManager from "@/components/admin/FeatureManager"
import ImageManager from "@/components/admin/ImageManager"
import ReservedDatesManager from "@/components/admin/ReservedDatesManager"
import { roomFormSchema, type RoomFormValues } from "@/components/admin/RoomFormSchema"

type RoomFormProps = {
  mode: "add" | "edit"
}

const RoomForm = ({ mode }: RoomFormProps) => {
  const { addRoom, updateRoom, rooms } = useDataStore()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [features, setFeatures] = useState<string[]>([])
  const [reservedDates, setReservedDates] = useState<DateRange | undefined>()
  const [roomImages, setRoomImages] = useState<{ id: number; url: string; alt: string }[]>([])
  const [lastModified, setLastModified] = useState<Date | null>(null)

  const roomId = id ? Number.parseInt(id) : undefined
  const currentRoom = roomId ? rooms.find((room) => room.id === roomId) : undefined

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues:
      mode === "edit" && currentRoom
        ? {
            title: currentRoom.title,
            location: currentRoom.location,
            price: currentRoom.price,
            rating: currentRoom.rating,
            reviews: currentRoom.reviews,
            image: "",
            type: currentRoom.type,
            area: currentRoom.area,
            description: currentRoom.description || "",
            isAvailable: currentRoom.available,
            features: currentRoom.features,
            lastModified: currentRoom.lastUpdated ? new Date(currentRoom.lastUpdated) : new Date(),
          }
        : {
            title: "",
            location: "",
            price: 0,
            rating: 5,
            reviews: 0,
            image: "",
            type: "Estándar",
            area: 0,
            description: "",
            isAvailable: true,
            features: [],
            lastModified: new Date(),
          },
  })

  useEffect(() => {
    if (mode === "edit" && currentRoom) {
      setFeatures(currentRoom.features)

      if (currentRoom.images && currentRoom.images.length > 0) {
        setRoomImages(currentRoom.images)
      } else if (currentRoom.image) {
        // Si no hay imágenes pero hay una imagen principal, la añadimos al array
        setRoomImages([
          {
            id: 1,
            url: currentRoom.image,
            alt: currentRoom.title,
          },
        ])
      }

      // Last modified date
      if (currentRoom.lastUpdated) {
        setLastModified(new Date(currentRoom.lastUpdated))
      }

      // If room has reserved dates, we'd use them here
      // This would need more logic to handle multiple date ranges
    }
  }, [currentRoom, mode])

  function onSubmit(values: RoomFormValues) {
    if (features.length === 0) {
      toast.error("Agregue al menos una característica")
      return
    }

    if (roomImages.length === 0) {
      toast.error("Agregue al menos una imagen")
      return
    }

    // Use the first image as the main image
    const mainImage = roomImages[0].url
    const now = new Date()

    if (mode === "edit" && currentRoom) {
      updateRoom({
        ...currentRoom,
        title: values.title,
        location: values.location,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: mainImage,
        type: values.type,
        area: values.area,
        description: values.description,
        isAvailable: values.isAvailable,
        available: values.isAvailable, // Aseguramos compatibilidad con ambos campos
        features,
        images: roomImages,
        lastUpdated: now.toISOString(),
      })
      toast.success("Habitación actualizada correctamente")
    } else {
      addRoom({
        title: values.title,
        location: values.location,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: mainImage,
        features,
        type: values.type,
        area: values.area,
        description: values.description,
        isAvailable: values.isAvailable,
        available: values.isAvailable, // Aseguramos compatibilidad con ambos campos
        reservedDates: [],
        images: roomImages,
        lastUpdated: now.toISOString(),
      })
      toast.success("Habitación agregada correctamente")
    }

    navigate("/admin/rooms")
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {lastModified && mode === "edit" && (
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Última modificación: {format(lastModified, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Fields */}
          <BasicInfoFields />

          <div className="space-y-4">
            {/* Image Manager */}
            <ImageManager roomImages={roomImages} setRoomImages={setRoomImages} />

            {/* Feature Manager */}
            <FeatureManager features={features} setFeatures={setFeatures} />

            {/* Reserved Dates Manager */}
            <ReservedDatesManager reservedDates={reservedDates} setReservedDates={setReservedDates} />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/rooms")}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-terracotta hover:bg-terracotta/90">
              {mode === "add" ? "Agregar habitación" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RoomForm

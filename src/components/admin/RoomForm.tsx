"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"

// Import refactored components and hooks
import BasicInfoFields from "@/components/admin/BasicInfoFields"
import FeatureManager from "@/components/admin/FeatureManager"
import ImageManager from "@/components/admin/ImageManager"
import ReservedDatesManager from "@/components/admin/ReservedDatesManager"
import PricingOptionsFields from "@/components/admin/PricingOptionsFields"
import WhatsAppConfigFields from "@/components/admin/WhatsAppConfigFields"
import { roomFormSchema, type RoomFormValues } from "@/components/admin/RoomFormSchema"
import { useRoomFormState } from "@/hooks/use-room-form-state"
import { useRoomFormSubmission } from "@/hooks/use-room-form-submission"

type RoomFormProps = {
  mode: "add" | "edit"
}

const RoomForm = ({ mode }: RoomFormProps) => {
  const { rooms } = useDataStore()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [showWhatsAppConfig, setShowWhatsAppConfig] = useState(true)

  const roomId = id ? Number.parseInt(id) : undefined
  const currentRoom = roomId ? rooms.find((room) => room.id === roomId) : undefined

  // Preparar valores iniciales para pricing
  const getInitialPricing = () => {
    if (mode === "edit" && currentRoom?.pricing) {
      return currentRoom.pricing
    }

    return {
      nationalTourism: {
        enabled: false,
        nightlyRate: { enabled: false, price: 0 },
        hourlyRate: { enabled: false, price: 0 },
      },
      internationalTourism: {
        enabled: false,
        nightlyRate: { enabled: false, price: 0 },
      },
    }
  }

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues:
      mode === "edit" && currentRoom
        ? {
            title: currentRoom.title,
            location: currentRoom.location,
            province: currentRoom.province || "",
            price: currentRoom.price,
            rating: currentRoom.rating,
            reviews: currentRoom.reviews,
            image: "",
            type: currentRoom.type,
            area: currentRoom.area,
            description: currentRoom.description || "",
            isAvailable: currentRoom.available !== false,
            features: currentRoom.features,
            lastModified: currentRoom.lastUpdated ? new Date(currentRoom.lastUpdated) : new Date(),
            pricing: getInitialPricing(),
            hostWhatsApp: {
              enabled: currentRoom.hostWhatsApp?.enabled || false,
              primary: currentRoom.hostWhatsApp?.primary || "",
              secondary: currentRoom.hostWhatsApp?.secondary || "",
              sendToPrimary: currentRoom.hostWhatsApp?.sendToPrimary ?? true,
              sendToSecondary: currentRoom.hostWhatsApp?.sendToSecondary ?? false,
            },
          }
        : {
            title: "",
            location: "",
            province: "",
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
            pricing: getInitialPricing(),
            hostWhatsApp: {
              enabled: false,
              primary: "",
              secondary: "",
              sendToPrimary: true,
              sendToSecondary: false,
            },
          },
  })

  const {
    features,
    setFeatures,
    roomImages,
    setRoomImages,
    lastModified,
    initialReservedDates,
    dateRange,
    setDateRange,
  } = useRoomFormState({ mode, currentRoom, form })

  const { handleSubmit } = useRoomFormSubmission({
    mode,
    currentRoom,
    features,
    roomImages,
    initialReservedDates,
    reservedDates: dateRange,
  })

  function onSubmit(values: RoomFormValues) {
    handleSubmit(values)
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

          {/* WhatsApp Configuration */}
          <WhatsAppConfigFields />

          {/* Pricing Options */}
          <PricingOptionsFields />

          <div className="space-y-4">
            {/* Image Manager */}
            <ImageManager roomImages={roomImages} setRoomImages={setRoomImages} />

            {/* Feature Manager */}
            <FeatureManager features={features} setFeatures={setFeatures} />

            {/* Reserved Dates Manager */}
            <ReservedDatesManager
              reservedDates={dateRange}
              setReservedDates={setDateRange}
              initialDates={currentRoom?.reservedDates || []}
            />
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

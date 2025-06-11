"use client"

import { useNavigate, useParams } from "react-router-dom"
import { useDataStore } from "@/hooks/use-data-store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, Home, Star, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/sonner"

// Import refactored components and hooks
import BasicInfoFields from "@/components/admin/BasicInfoFields"
import FeatureManager from "@/components/admin/FeatureManager"
import ImageManager from "@/components/admin/ImageManager"
import ReservedDatesManager from "@/components/admin/ReservedDatesManager"
import PricingOptionsFields from "@/components/admin/PricingOptionsFields"
import WhatsAppConfigFields from "@/components/admin/WhatsAppConfigFields"
import HostsManager from "@/components/admin/HostsManager"
import CapacityFields from "@/components/admin/CapacityFields"
import { roomFormSchema } from "@/components/admin/RoomFormSchema"
import type { Room, HostInfo } from "@/types/room"

type RoomFormProps = {
  mode: "add" | "edit"
}

const RoomForm = ({ mode }: RoomFormProps) => {
  const { rooms, addRoom, updateRoom } = useDataStore()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Estados para manejar los datos del formulario
  const [features, setFeatures] = useState<string[]>([])
  const [roomImages, setRoomImages] = useState<Array<{ id: number; url: string; alt: string }>>([])
  const [dateRange, setDateRange] = useState<any>(undefined)
  const [hosts, setHosts] = useState<HostInfo[]>([])

  // Obtener la habitación actual si estamos en modo edición
  const roomId = id ? Number.parseInt(id) : undefined
  const currentRoom = roomId ? rooms.find((room) => room.id === roomId) : undefined

  // Configurar el formulario con valores iniciales
  const form = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      title: currentRoom?.title || "",
      location: currentRoom?.location || "",
      province: currentRoom?.province || "",
      price: currentRoom?.price || 0,
      rating: currentRoom?.rating || 5,
      reviews: currentRoom?.reviews || 0,
      type: currentRoom?.type || "Estándar",
      area: currentRoom?.area || 0,
      description: currentRoom?.description || "",
      isAvailable: currentRoom?.available !== false,
      accommodationType: currentRoom?.accommodationType || "Habitación en alojamiento entero",
      capacity: {
        maxGuests: currentRoom?.capacity?.maxGuests || 4,
        beds: currentRoom?.capacity?.beds || 1,
        bedrooms: currentRoom?.capacity?.bedrooms || 1,
        bathrooms: currentRoom?.capacity?.bathrooms || 1,
      },
      hostWhatsApp: {
        enabled: currentRoom?.hostWhatsApp?.enabled || false,
        primary: currentRoom?.hostWhatsApp?.primary || "",
        secondary: currentRoom?.hostWhatsApp?.secondary || "",
        sendToPrimary: currentRoom?.hostWhatsApp?.sendToPrimary ?? true,
        sendToSecondary: currentRoom?.hostWhatsApp?.sendToSecondary ?? false,
      },
      pricing: currentRoom?.pricing || {
        nationalTourism: {
          enabled: false,
          nightlyRate: { enabled: false, price: 0 },
          hourlyRate: { enabled: false, price: 0 },
        },
        internationalTourism: {
          enabled: false,
          nightlyRate: { enabled: false, price: 0 },
        },
      },
    },
  })

  // Cargar datos iniciales cuando se monta el componente
  useEffect(() => {
    if (currentRoom) {
      // Cargar características
      setFeatures(currentRoom.features || [])

      // Cargar imágenes
      setRoomImages(currentRoom.images || [])

      // Cargar fechas reservadas
      if (currentRoom.reservedDates && currentRoom.reservedDates.length > 0) {
        // Convertir fechas reservadas al formato esperado por el componente
        const dates = currentRoom.reservedDates.map((date) => ({
          from: new Date(date.start),
          to: new Date(date.end),
        }))
        setDateRange(dates)
      }

      // Cargar anfitriones
      setHosts(
        currentRoom.hosts || [
          {
            id: Date.now(),
            name: "Anfitrión",
            hostSince: new Date().getFullYear().toString(),
            bio: "Información del anfitrión",
            isPrimary: true,
            avatar: "",
          },
        ],
      )
    } else {
      // Valores por defecto para nueva habitación
      setHosts([
        {
          id: Date.now(),
          name: "Anfitrión",
          hostSince: new Date().getFullYear().toString(),
          bio: "Información del anfitrión",
          isPrimary: true,
          avatar: "",
        },
      ])
    }
  }, [currentRoom])

  // Manejar el envío del formulario
  const onSubmit = (values: any) => {
    try {
      console.log("Guardando habitación:", values)

      // Obtener fechas reservadas del DOM
      const savedReservedDates: Array<{ start: string; end: string }> = []
      const reservedDateElements = document.querySelectorAll('[data-reserved-date="true"]')
      reservedDateElements.forEach((element) => {
        const startDate = element.getAttribute("data-start")
        const endDate = element.getAttribute("data-end")
        if (startDate && endDate) {
          savedReservedDates.push({
            start: startDate,
            end: endDate,
          })
        }
      })

      // Validar WhatsApp
      if (values.hostWhatsApp.enabled && !values.hostWhatsApp.primary) {
        toast.error("Si habilita WhatsApp, debe proporcionar al menos el número principal")
        return
      }

      // Validar anfitriones
      if (!hosts || hosts.length === 0) {
        toast.error("Debe añadir al menos un anfitrión")
        return
      }

      if (!hosts.some((host) => host.isPrimary)) {
        toast.error("Debe designar un anfitrión principal")
        return
      }

      // Preparar datos de la habitación
      const roomData: Room = {
        id: currentRoom?.id || Math.floor(Math.random() * 10000),
        title: values.title,
        location: values.location,
        province: values.province,
        price: values.price,
        rating: values.rating,
        reviews: values.reviews,
        image: roomImages[0]?.url || currentRoom?.image || "",
        type: values.type,
        area: values.area,
        description: values.description,
        available: values.isAvailable,
        features: features,
        lastUpdated: new Date().toISOString(),
        pricing: values.pricing,
        images: roomImages.length > 0 ? roomImages : currentRoom?.images || [],
        reservedDates: savedReservedDates.length > 0 ? savedReservedDates : currentRoom?.reservedDates || [],
        hostWhatsApp: values.hostWhatsApp.enabled
          ? {
              enabled: true,
              primary: values.hostWhatsApp.primary?.trim() || "",
              secondary: values.hostWhatsApp.secondary?.trim() || "",
              sendToPrimary: values.hostWhatsApp.sendToPrimary,
              sendToSecondary: values.hostWhatsApp.sendToSecondary,
            }
          : {
              enabled: false,
              primary: "",
              secondary: "",
              sendToPrimary: false,
              sendToSecondary: false,
            },
        hosts: hosts,
        capacity: values.capacity,
        accommodationType: values.accommodationType,
      }

      // Guardar la habitación
      if (mode === "add") {
        addRoom(roomData)
        toast.success("Habitación creada correctamente")
      } else {
        updateRoom(roomData)
        toast.success("Habitación actualizada correctamente")
      }

      // Redirigir a la lista de habitaciones
      navigate("/admin/rooms")
    } catch (error) {
      console.error("Error al guardar la habitación:", error)
      toast.error("Error al guardar la habitación: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {currentRoom?.lastUpdated && (
        <div className="mb-4 text-sm text-muted-foreground">
          <p>
            Última modificación:{" "}
            {format(new Date(currentRoom.lastUpdated), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm:ss", { locale: es })}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="basic" className="flex items-center gap-1 text-xs">
                <Home className="h-3 w-3" />
                <span className="hidden sm:inline">Básico</span>
              </TabsTrigger>
              <TabsTrigger value="capacity" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                <span className="hidden sm:inline">Capacidad</span>
              </TabsTrigger>
              <TabsTrigger value="hosts" className="flex items-center gap-1 text-xs">
                <UserCheck className="h-3 w-3" />
                <span className="hidden sm:inline">Anfitriones</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-1 text-xs">
                <span className="text-green-600">📱</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-1 text-xs">
                <CreditCard className="h-3 w-3" />
                <span className="hidden sm:inline">Precios</span>
              </TabsTrigger>
              <TabsTrigger value="extras" className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3" />
                <span className="hidden sm:inline">Extras</span>
              </TabsTrigger>
            </TabsList>

            {/* Pestaña de Información Básica */}
            <TabsContent value="basic">
              <div className="space-y-6">
                <BasicInfoFields />

                {/* Servicios/Características */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    Servicios y Características
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seleccione las características y servicios que ofrece esta habitación.
                  </p>
                  <FeatureManager features={features} setFeatures={setFeatures} />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña de Capacidad */}
            <TabsContent value="capacity">
              <CapacityFields />
            </TabsContent>

            {/* Pestaña de Anfitriones */}
            <TabsContent value="hosts">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Gestión de Anfitriones
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure los anfitriones para esta habitación. Puede añadir múltiples anfitriones y designar uno
                    como principal. Los cambios se guardarán cuando haga clic en "Guardar cambios".
                  </p>
                  <HostsManager hosts={hosts} onChange={setHosts} />
                </div>
              </div>
            </TabsContent>

            {/* Pestaña de WhatsApp */}
            <TabsContent value="whatsapp">
              <WhatsAppConfigFields />
            </TabsContent>

            {/* Pestaña de Precios */}
            <TabsContent value="pricing">
              <PricingOptionsFields />
            </TabsContent>

            {/* Pestaña de Extras (Imágenes, Fechas) */}
            <TabsContent value="extras">
              <div className="space-y-6">
                {/* Image Manager */}
                <ImageManager roomImages={roomImages} setRoomImages={setRoomImages} />

                {/* Reserved Dates Manager */}
                <ReservedDatesManager
                  reservedDates={dateRange}
                  setReservedDates={setDateRange}
                  initialDates={currentRoom?.reservedDates || []}
                />
              </div>
            </TabsContent>
          </Tabs>

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

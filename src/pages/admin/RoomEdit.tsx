"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MessageCircle, Users, User } from "lucide-react"
import { useConfig } from "@/contexts/ConfigContext"
import type { Room } from "@/types/room"
import { WhatsAppInput } from "@/components/ui/whatsapp-input"

const RoomEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rooms, addRoom, updateRoom } = useConfig()
  const isNewRoom = id === undefined

  // Estado para el formulario
  const [formData, setFormData] = useState<Room>({
    id: 0,
    title: "",
    description: "",
    price: 0,
    location: "",
    province: "",
    rating: 5,
    reviews: 0,
    image: "",
    features: [],
    type: "Estándar",
    area: 30,
    available: true,
    hostWhatsApp: {
      enabled: false,
      primary: "",
      secondary: "",
      sendToPrimary: true,
      sendToSecondary: false,
    },
  })

  // Estados para validación de WhatsApp
  const [primaryValid, setPrimaryValid] = useState(false)
  const [secondaryValid, setSecondaryValid] = useState(false)

  // Estado para nuevas imágenes y amenidades
  const [newImage, setNewImage] = useState("")
  const [newAmenity, setNewAmenity] = useState("")

  // Cargar datos de la habitación si estamos editando
  useEffect(() => {
    if (!isNewRoom && id) {
      const room = rooms.find((r) => r.id === Number(id))
      if (room) {
        setFormData(room)
      } else {
        navigate("/admin/rooms")
      }
    } else {
      // Si es una nueva habitación, generar un ID único
      setFormData((prev) => ({ ...prev, id: Math.floor(Math.random() * 10000) }))
    }
  }, [id, rooms, isNewRoom, navigate])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // Manejar cambios en el switch
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  // Manejar cambios en el select
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, currency: value }))
  }

  // Añadir una nueva imagen
  const handleAddImage = () => {
    if (newImage.trim() && !formData.images?.some((img) => img.url === newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), { id: Date.now(), url: newImage.trim(), alt: "Imagen de habitación" }],
      }))
      setNewImage("")
    }
  }

  // Eliminar una imagen
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  // Añadir una nueva amenidad
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.features.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  // Eliminar una amenidad
  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  // Guardar la habitación
  const handleSave = () => {
    // Validar que si WhatsApp está habilitado, al menos el número principal esté configurado
    if (formData.hostWhatsApp?.enabled && !formData.hostWhatsApp.primary) {
      alert("Si habilita WhatsApp, debe proporcionar al menos el número principal")
      return
    }

    // Asegurarse de que los valores de sendToPrimary y sendToSecondary estén configurados
    const updatedFormData = {
      ...formData,
      hostWhatsApp: formData.hostWhatsApp?.enabled
        ? {
            ...formData.hostWhatsApp,
            sendToPrimary: formData.hostWhatsApp.sendToPrimary ?? true,
            sendToSecondary: formData.hostWhatsApp.sendToSecondary ?? false,
          }
        : undefined,
    }

    if (isNewRoom) {
      addRoom(updatedFormData)
    } else {
      updateRoom(updatedFormData.id, updatedFormData)
    }
    navigate("/admin/rooms")
  }

  // Volver a la lista de habitaciones
  const handleBack = () => {
    navigate("/admin/rooms")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isNewRoom ? "Añadir Nueva Habitación" : "Editar Habitación"}
        </h1>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Detalles principales de la habitación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nombre de la Habitación</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Suite Deluxe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="La Habana, Cuba"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Una habitación espaciosa con vistas al mar..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleNumberChange}
                min={0}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Calificación</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleNumberChange}
                min={1}
                max={5}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" name="area" type="number" value={formData.area} onChange={handleNumberChange} min={1} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de WhatsApp de Anfitriones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Configuración de WhatsApp de Anfitriones
          </CardTitle>
          <CardDescription>
            Configure los números de WhatsApp de los anfitriones para recibir notificaciones de reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Switch principal para habilitar WhatsApp */}
          <div className="flex items-center space-x-2">
            <Switch
              id="whatsappEnabled"
              checked={formData.hostWhatsApp?.enabled || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  hostWhatsApp: {
                    ...prev.hostWhatsApp,
                    primary: prev.hostWhatsApp?.primary || "",
                    secondary: prev.hostWhatsApp?.secondary || "",
                    enabled: checked,
                    sendToPrimary: prev.hostWhatsApp?.sendToPrimary ?? true,
                    sendToSecondary: prev.hostWhatsApp?.sendToSecondary ?? false,
                  },
                }))
              }
            />
            <Label htmlFor="whatsappEnabled" className="text-base font-medium">
              Habilitar notificaciones por WhatsApp
            </Label>
          </div>

          {formData.hostWhatsApp?.enabled && (
            <div className="space-y-6 p-4 border rounded-lg bg-muted/30">
              {/* Anfitrión Principal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <Label className="text-base font-medium">Anfitrión Principal</Label>
                  <span className="text-red-500">*</span>
                </div>
                <WhatsAppInput
                  value={formData.hostWhatsApp?.primary || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      hostWhatsApp: {
                        ...prev.hostWhatsApp,
                        primary: value,
                        secondary: prev.hostWhatsApp?.secondary || "",
                        enabled: prev.hostWhatsApp?.enabled || false,
                        sendToPrimary: prev.hostWhatsApp?.sendToPrimary ?? true,
                        sendToSecondary: prev.hostWhatsApp?.sendToSecondary ?? false,
                      },
                    }))
                  }
                  onValidationChange={setPrimaryValid}
                  placeholder="+53512345678"
                  label=""
                  description="Número principal que recibirá las notificaciones de reservas"
                  required
                />
              </div>

              {/* Anfitrión Secundario */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <Label className="text-base font-medium">Anfitrión Secundario</Label>
                  <span className="text-muted-foreground text-sm">(Opcional)</span>
                </div>
                <WhatsAppInput
                  value={formData.hostWhatsApp?.secondary || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      hostWhatsApp: {
                        ...prev.hostWhatsApp,
                        primary: prev.hostWhatsApp?.primary || "",
                        secondary: value,
                        enabled: prev.hostWhatsApp?.enabled || false,
                        sendToPrimary: prev.hostWhatsApp?.sendToPrimary ?? true,
                        sendToSecondary: prev.hostWhatsApp?.sendToSecondary ?? false,
                      },
                    }))
                  }
                  onValidationChange={setSecondaryValid}
                  placeholder="+53587654321"
                  label=""
                  description="Número secundario que también puede recibir notificaciones"
                />
              </div>

              {/* Configuración de envío de mensajes */}
              <div className="space-y-3 p-4 border rounded-lg bg-background">
                <Label className="text-base font-medium">Configuración de Envío de Mensajes</Label>
                <p className="text-sm text-muted-foreground">
                  Seleccione a qué anfitriones se enviarán las notificaciones de reservas
                </p>

                <div className="space-y-3">
                  {/* Enviar al anfitrión principal */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendToPrimary"
                      checked={formData.hostWhatsApp?.sendToPrimary ?? true}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          hostWhatsApp: {
                            ...prev.hostWhatsApp,
                            primary: prev.hostWhatsApp?.primary || "",
                            secondary: prev.hostWhatsApp?.secondary || "",
                            enabled: prev.hostWhatsApp?.enabled || false,
                            sendToPrimary: checked as boolean,
                            sendToSecondary: prev.hostWhatsApp?.sendToSecondary ?? false,
                          },
                        }))
                      }
                      disabled={!primaryValid || !formData.hostWhatsApp?.primary}
                    />
                    <Label htmlFor="sendToPrimary" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Enviar al Anfitrión Principal
                      {primaryValid && formData.hostWhatsApp?.primary && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ Válido</span>
                      )}
                    </Label>
                  </div>

                  {/* Enviar al anfitrión secundario */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendToSecondary"
                      checked={formData.hostWhatsApp?.sendToSecondary ?? false}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          hostWhatsApp: {
                            ...prev.hostWhatsApp,
                            primary: prev.hostWhatsApp?.primary || "",
                            secondary: prev.hostWhatsApp?.secondary || "",
                            enabled: prev.hostWhatsApp?.enabled || false,
                            sendToPrimary: prev.hostWhatsApp?.sendToPrimary ?? true,
                            sendToSecondary: checked as boolean,
                          },
                        }))
                      }
                      disabled={!secondaryValid || !formData.hostWhatsApp?.secondary}
                    />
                    <Label htmlFor="sendToSecondary" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      Enviar al Anfitrión Secundario
                      {secondaryValid && formData.hostWhatsApp?.secondary && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ Válido</span>
                      )}
                    </Label>
                  </div>
                </div>

                {/* Mensaje de ayuda */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Consejo:</strong> Puede seleccionar uno o ambos anfitriones para recibir las
                    notificaciones. Esto es útil para tener respaldo en caso de que un anfitrión no esté disponible.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-terracotta hover:bg-terracotta/90">
          {isNewRoom ? "Crear Habitación" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  )
}

export default RoomEdit

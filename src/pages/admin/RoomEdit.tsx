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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageCircle, Users, User, Home, Bed, Bath, UserCheck, Save } from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store" // Cambiado de useConfig a useDataStore
import type { Room, HostInfo } from "@/types/room"
import { WhatsAppInput } from "@/components/ui/whatsapp-input"
import HostsManager from "@/components/admin/HostsManager"
import { toast } from "@/components/ui/sonner" // Añadido para mostrar notificaciones

// Actualizar la función RoomEdit para usar useDataStore
const RoomEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rooms, addRoom, updateRoom } = useDataStore() // Cambiado de useConfig a useDataStore
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
    accommodationType: "Habitación en alojamiento entero",
    capacity: {
      maxGuests: 4,
      beds: 1,
      bedrooms: 1,
      bathrooms: 1,
    },
    hosts: [
      {
        id: Date.now(),
        name: "Eliezer",
        hostSince: "2017",
        bio: "Anfitrión experimentado con años de experiencia en hospitalidad",
        isPrimary: true,
      },
    ],
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

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("basic")

  // Cargar datos de la habitación si estamos editando
  useEffect(() => {
    if (!isNewRoom && id) {
      const room = rooms.find((r) => r.id === Number(id))
      if (room) {
        // Asegurar que todos los campos tengan valores por defecto
        setFormData({
          ...room,
          accommodationType: room.accommodationType || "Habitación en alojamiento entero",
          capacity: room.capacity || {
            maxGuests: 4,
            beds: 1,
            bedrooms: 1,
            bathrooms: 1,
          },
          hosts: room.hosts || [
            {
              id: Date.now(),
              name: "Eliezer",
              hostSince: "2017",
              bio: "Anfitrión experimentado con años de experiencia en hospitalidad",
              isPrimary: true,
            },
          ],
        })
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

  // Manejar cambios en la capacidad
  const handleCapacityChange = (field: keyof typeof formData.capacity, value: number) => {
    setFormData((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity!,
        [field]: value,
      },
    }))
  }

  // Manejar cambios en los anfitriones
  const handleHostsChange = (hosts: HostInfo[]) => {
    setFormData((prev) => ({
      ...prev,
      hosts: hosts,
    }))
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
      toast.error("Si habilita WhatsApp, debe proporcionar al menos el número principal")
      return
    }

    // Validar que haya al menos un anfitrión
    if (!formData.hosts || formData.hosts.length === 0) {
      toast.error("Debe añadir al menos un anfitrión")
      return
    }

    // Validar que haya un anfitrión primario
    if (!formData.hosts.some((host) => host.isPrimary)) {
      toast.error("Debe designar un anfitrión principal")
      return
    }

    // Asegurarse de que los valores estén correctamente configurados
    const updatedFormData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
      // Asegurar que la capacidad esté correctamente configurada
      capacity: {
        maxGuests: formData.capacity?.maxGuests || 4,
        beds: formData.capacity?.beds || 1,
        bedrooms: formData.capacity?.bedrooms || 1,
        bathrooms: formData.capacity?.bathrooms || 1,
      },
      // Asegurar que los anfitriones estén correctamente configurados
      hosts:
        formData.hosts?.map((host) => ({
          ...host,
          name: host.name || "Anfitrión",
          hostSince: host.hostSince || new Date().getFullYear().toString(),
          isPrimary: host.isPrimary || false,
          bio: host.bio || "",
          avatar: host.avatar || "",
        })) || [],
      hostWhatsApp: formData.hostWhatsApp?.enabled
        ? {
            ...formData.hostWhatsApp,
            sendToPrimary: formData.hostWhatsApp.sendToPrimary ?? true,
            sendToSecondary: formData.hostWhatsApp.sendToSecondary ?? false,
          }
        : undefined,
    }

    try {
      if (isNewRoom) {
        addRoom(updatedFormData)
        toast.success("Habitación creada correctamente")
      } else {
        updateRoom(updatedFormData)
        toast.success("Habitación actualizada correctamente")
      }
      navigate("/admin/rooms")
    } catch (error) {
      console.error("Error al guardar la habitación:", error)
      toast.error("Error al guardar la habitación")
    }
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button onClick={handleSave} className="bg-terracotta hover:bg-terracotta/90">
            <Save className="mr-2 h-4 w-4" />
            {isNewRoom ? "Crear Habitación" : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Información Básica</span>
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Capacidad</span>
          </TabsTrigger>
          <TabsTrigger value="hosts" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Anfitriones</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Información Básica */}
        <TabsContent value="basic">
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
                  <Label htmlFor="price">Precio Base</Label>
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
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleNumberChange}
                    min={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Capacidad */}
        <TabsContent value="capacity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Tipo de Alojamiento y Capacidad
              </CardTitle>
              <CardDescription>Configure el tipo de alojamiento y la capacidad de huéspedes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="accommodationType">Tipo de Alojamiento</Label>
                <Select
                  value={formData.accommodationType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, accommodationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de alojamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Habitación en alojamiento entero">Habitación en alojamiento entero</SelectItem>
                    <SelectItem value="Habitación privada">Habitación privada</SelectItem>
                    <SelectItem value="Habitación compartida">Habitación compartida</SelectItem>
                    <SelectItem value="Casa completa">Casa completa</SelectItem>
                    <SelectItem value="Apartamento completo">Apartamento completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Máximo Huéspedes
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacity?.maxGuests || 4}
                    onChange={(e) => handleCapacityChange("maxGuests", Number.parseInt(e.target.value) || 4)}
                    min={1}
                    max={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-purple-600" />
                    Camas
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacity?.beds || 1}
                    onChange={(e) => handleCapacityChange("beds", Number.parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-orange-600" />
                    Habitaciones
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacity?.bedrooms || 1}
                    onChange={(e) => handleCapacityChange("bedrooms", Number.parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-blue-600" />
                    Baños
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacity?.bathrooms || 1}
                    onChange={(e) => handleCapacityChange("bathrooms", Number.parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Vista previa:</strong> {formData.accommodationType} • Máximo{" "}
                  {formData.capacity?.maxGuests || 4} huéspedes • {formData.capacity?.beds || 1} cama
                  {(formData.capacity?.beds || 1) > 1 ? "s" : ""} • {formData.capacity?.bedrooms || 1} habitación
                  {(formData.capacity?.bedrooms || 1) > 1 ? "es" : ""} • {formData.capacity?.bathrooms || 1} baño
                  {(formData.capacity?.bathrooms || 1) > 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Anfitriones */}
        <TabsContent value="hosts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                Información de Anfitriones
              </CardTitle>
              <CardDescription>
                Configure los anfitriones para esta habitación. Puede añadir múltiples anfitriones y designar uno como
                principal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HostsManager hosts={formData.hosts || []} onChange={handleHostsChange} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de WhatsApp */}
        <TabsContent value="whatsapp">
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
        </TabsContent>
      </Tabs>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-terracotta hover:bg-terracotta/90">
          <Save className="mr-2 h-4 w-4" />
          {isNewRoom ? "Crear Habitación" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  )
}

export default RoomEdit

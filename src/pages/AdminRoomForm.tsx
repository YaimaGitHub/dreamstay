
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useDataStore } from "@/hooks/use-data-store"
import { ArrowLeft, Plus, X, Save, Download, Loader2 } from "lucide-react"
import type { Room } from "@/types/room"

const AdminRoomForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { rooms, addRoom, updateRoom, generateTypeScriptFiles } = useDataStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false)
  const [saveCompleted, setSaveCompleted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const isEditMode = id !== undefined && id !== "new"
  const roomToEdit = isEditMode ? rooms.find((r) => r.id === Number.parseInt(id as string)) : null

  const [formData, setFormData] = useState<Omit<Room, "id">>({
    title: "",
    location: "",
    price: 0,
    rating: 5.0,
    reviews: 0,
    image: "",
    features: [],
    type: "Estándar",
    area: 0,
    available: true,
    description: "",
    images: [],
  })

  const [newFeature, setNewFeature] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageAlt, setNewImageAlt] = useState("")

  // Check authentication status on mount
  useEffect(() => {
    // Verify authentication on component mount
    const checkAuth = () => {
      const adminSession = localStorage.getItem("adminAuth")
      if (adminSession !== "true") {
        setIsAuthenticated(false)
      }
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        title: roomToEdit.title,
        location: roomToEdit.location,
        price: roomToEdit.price,
        rating: roomToEdit.rating,
        reviews: roomToEdit.reviews,
        image: roomToEdit.image,
        features: roomToEdit.features || [],
        type: roomToEdit.type,
        area: roomToEdit.area,
        available: roomToEdit.available !== undefined ? roomToEdit.available : true,
        description: roomToEdit.description || "",
        images: roomToEdit.images || [],
      })
    }
  }, [roomToEdit])

  // Protect against session expiration during form submission
  useEffect(() => {
    if (!isAuthenticated && !isSubmitting && !isGeneratingFiles) {
      navigate("/admin/login")
    }
  }, [isAuthenticated, isSubmitting, isGeneratingFiles, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "area" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      available: checked,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addImage = () => {
    if (newImageUrl.trim() !== "") {
      const newId =
        formData.images && formData.images.length > 0 ? Math.max(...formData.images.map((img) => img.id)) + 1 : 1

      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          {
            id: newId,
            url: newImageUrl.trim(),
            alt: newImageAlt.trim() || `Imagen de ${formData.title}`,
          },
        ],
      }))
      setNewImageUrl("")
      setNewImageAlt("")
    }
  }

  const removeImage = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Ensure the first image is the main image
    if (formData.images && formData.images.length > 0 && !formData.image) {
      formData.image = formData.images[0].url
    }

    // Add timestamp for tracking changes
    const now = new Date()
    const formDataWithTimestamp = {
      ...formData,
      lastModified: now.toISOString(),
    }

    setTimeout(() => {
      if (isEditMode && roomToEdit) {
        updateRoom({
          ...formDataWithTimestamp,
          id: Number.parseInt(id as string)
        })
        toast({
          title: "Habitación actualizada",
          description: "Los cambios han sido guardados correctamente",
        })

        // No redirection in edit mode
        setSaveCompleted(true)
      } else {
        addRoom(formDataWithTimestamp)
        toast({
          title: "Habitación creada",
          description: "La nueva habitación ha sido añadida correctamente",
        })

        // No immediate redirection
        setSaveCompleted(true)
      }
      setIsSubmitting(false)
    }, 1000)
  }

  const handleGenerateFiles = async () => {
    setIsGeneratingFiles(true)
    try {
      // Use await to wait for file generation to complete
      const success = await generateTypeScriptFiles()
      
      if (success) {
        toast({
          title: "Archivos TypeScript generados",
          description: "Los archivos se han descargado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudieron generar los archivos TypeScript",
          variant: "destructive",
        })
      }
      
      // Only navigate away after files are generated
      navigate("/admin/rooms")
    } catch (error) {
      console.error("Error al generar archivos:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al generar los archivos",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingFiles(false)
    }
  }

  // If session is already expired and we're not in the middle of an operation, redirect
  if (!isAuthenticated && !isSubmitting && !isGeneratingFiles) {
    return null // Navigate effect will handle redirection
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/rooms")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditMode ? "Editar habitación" : "Nueva habitación"}</h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Modifica los detalles de la habitación existente"
                : "Añade una nueva habitación a tu plataforma"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
                <CardDescription>Introduce los detalles principales de la habitación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nombre de la habitación</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de habitación</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Estándar">Estándar</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Familiar">Familiar</SelectItem>
                        <SelectItem value="Económica">Económica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio por noche ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      min="0"
                      value={formData.area}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" checked={formData.available} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="available">Disponible para reservas</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
                <CardDescription>Añade las características y comodidades de la habitación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Añadir característica..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <Button type="button" onClick={addFeature} className="bg-terracotta hover:bg-terracotta/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
                      <span className="mr-2">{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>Añade imágenes para mostrar la habitación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newImageUrl">URL de la imagen</Label>
                      <Input
                        id="newImageUrl"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newImageAlt">Texto alternativo</Label>
                      <Input
                        id="newImageAlt"
                        placeholder="Descripción de la imagen"
                        value={newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="button" onClick={addImage} className="bg-terracotta hover:bg-terracotta/90">
                    <Plus className="h-4 w-4 mr-2" /> Añadir imagen
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.images &&
                    formData.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
                <CardDescription>Así se verá la habitación en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-[16/10] rounded-md overflow-hidden bg-muted">
                    {formData.image ? (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : formData.images && formData.images.length > 0 ? (
                      <img
                        src={formData.images[0].url || "/placeholder.svg"}
                        alt={formData.images[0].alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{formData.title || "Título de la habitación"}</h3>
                    <p className="text-sm text-muted-foreground">{formData.location || "Ubicación"}</p>
                    <div className="mt-2">
                      <span className="font-bold">${formData.price}</span>
                      <span className="text-muted-foreground text-sm"> / noche</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                    {formData.features.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        +{formData.features.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col gap-4">
                {!saveCompleted ? (
                  <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Guardando cambios..." : "Creando habitación..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? "Guardar cambios" : "Crear habitación"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleGenerateFiles}
                    disabled={isGeneratingFiles}
                  >
                    {isGeneratingFiles ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando archivos...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Generar archivos TypeScript
                      </>
                    )}
                  </Button>
                )}
                <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/admin/rooms")}>
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}

export default AdminRoomForm

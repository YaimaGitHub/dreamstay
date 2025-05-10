"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useDataStore, type Service } from "@/hooks/use-data-store"
import { ArrowLeft, Plus, X, Save } from "lucide-react"

const AdminServiceForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { services, addService, updateService } = useDataStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = id !== undefined && id !== "new"
  const serviceToEdit = isEditMode ? services.find((s) => s.id === Number.parseInt(id as string)) : null

  const [formData, setFormData] = useState<Omit<Service, "id">>({
    title: "",
    description: "",
    longDescription: "",
    price: 0,
    category: "comodidades",
    features: [],
  })

  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        title: serviceToEdit.title,
        description: serviceToEdit.description,
        longDescription: serviceToEdit.longDescription || "",
        price: serviceToEdit.price,
        category: serviceToEdit.category,
        features: serviceToEdit.features || [],
      })
    }
  }, [serviceToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
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
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      if (isEditMode && serviceToEdit) {
        updateService(Number.parseInt(id as string), formData)
        toast({
          title: "Servicio actualizado",
          description: "Los cambios han sido guardados correctamente",
        })
      } else {
        addService(formData)
        toast({
          title: "Servicio creado",
          description: "El nuevo servicio ha sido añadido correctamente",
        })
      }
      setIsSubmitting(false)
      navigate("/admin/services")
    }, 1000)
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/services")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{isEditMode ? "Editar servicio" : "Nuevo servicio"}</h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Modifica los detalles del servicio existente" : "Añade un nuevo servicio a tu plataforma"}
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
                <CardDescription>Introduce los detalles principales del servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nombre del servicio</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción corta</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Descripción detallada</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="gastronomía">Gastronomía</SelectItem>
                        <SelectItem value="comodidades">Comodidades</SelectItem>
                        <SelectItem value="experiencias">Experiencias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio ($)</Label>
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
                <CardDescription>Añade las características y beneficios del servicio</CardDescription>
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
                  {formData.features &&
                    formData.features.map((feature, index) => (
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
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
                <CardDescription>Así se verá el servicio en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{formData.title || "Título del servicio"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.description || "Descripción corta del servicio"}
                    </p>
                    <div className="mt-2">
                      <span className="font-bold">{formData.price > 0 ? `$${formData.price}` : "Incluido"}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {formData.features && formData.features.length > 0 ? (
                        formData.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <span className="mr-2 text-terracotta">•</span>
                            {feature}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground">No hay características añadidas</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta/90" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting
                    ? isEditMode
                      ? "Guardando cambios..."
                      : "Creando servicio..."
                    : isEditMode
                      ? "Guardar cambios"
                      : "Crear servicio"}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/admin/services")}>
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

export default AdminServiceForm

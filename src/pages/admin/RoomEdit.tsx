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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { useConfig } from "@/contexts/ConfigContext"
import type { Room } from "@/types/room"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

const RoomEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, addRoom, updateRoom } = useConfig();
  const isNewRoom = id === undefined;

  // Estado para el formulario
  const [formData, setFormData] = useState<Room>({
    id: '',
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    capacity: 2,
    size: 30,
    images: [],
    amenities: [],
    availableDates: {
      start: new Date().toISOString(),
      end: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    },
    featured: false,
  });

  // Estado para nuevas imágenes y amenidades
  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Cargar datos de la habitación si estamos editando
  useEffect(() => {
    if (!isNewRoom && id) {
      const room = rooms.find(r => r.id === id);
      if (room) {
        setFormData(room);
      } else {
        navigate('/admin/rooms');
      }
    } else {
      // Si es una nueva habitación, generar un ID único
      setFormData(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [id, rooms, isNewRoom, navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en campos numéricos
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number.parseFloat(value) || 0 }));
  };

  // Manejar cambios en el switch
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  // Manejar cambios en el select
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, currency: value }));
  };

  // Manejar cambios en las fechas
  const handleDateChange = (field: 'start' | 'end', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        availableDates: {
          ...prev.availableDates,
          [field]: date.toISOString()
        }
      }));
    }
  };

  // Añadir una nueva imagen
  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  // Eliminar una imagen
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Añadir una nueva amenidad
  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  // Eliminar una amenidad
  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  // Guardar la habitación
  const handleSave = () => {
    if (isNewRoom) {
      addRoom(formData);
    } else {
      updateRoom(formData.id, formData);
    }
    navigate('/admin/rooms');
  };

  // Volver a la lista de habitaciones
  const handleBack = () => {
    navigate('/admin/rooms');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isNewRoom ? 'Añadir Nueva Habitación' : 'Editar Habitación'}
        </h1>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>
            Detalles principales de la habitación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Habitación</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Suite Deluxe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured">Destacada</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="featured">
                  {formData.featured ? 'Sí' : 'No'}
                </Label>
              </div>
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
              <Label htmlFor="currency">Moneda</Label>
              <Select value={formData.currency} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad (personas)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleNumberChange}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Tamaño (m²)</Label>
            <Input
              id="size"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleNumberChange}
              min={1}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fechas de Disponibilidad</CardTitle>
          <CardDescription>
            Establece el período en que la habitación estará disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.availableDates.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.availableDates.start ? (
                      format(new Date(formData.availableDates.start), "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.availableDates.start ? new Date(formData.availableDates.start) : undefined}
                    onSelect={(date) => handleDateChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Fecha de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.availableDates.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.availableDates.end ? (
                      format(new Date(formData.availableDates.end), "PPP\

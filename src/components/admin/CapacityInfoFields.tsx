"use client"

import { FormDescription, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bed, Home, Bath } from "lucide-react"
import type { Room } from "@/types/room"

interface CapacityInfoFieldsProps {
  formData: Room
  updateField: (field: string, value: any) => void
  updateNestedField: (parentField: string, field: string, value: any) => void
}

const CapacityInfoFields = ({ formData, updateField, updateNestedField }: CapacityInfoFieldsProps) => {
  const accommodationTypes = [
    "Habitación en alojamiento entero",
    "Habitación privada",
    "Habitación compartida",
    "Casa completa",
    "Apartamento completo",
    "Estudio",
    "Loft",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-orange-600" />
          Información de Capacidad y Alojamiento
        </CardTitle>
        <CardDescription>
          Configura los detalles de capacidad y tipo de alojamiento para esta habitación.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Alojamiento */}
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Tipo de Alojamiento
          </FormLabel>
          <Select
            value={formData.accommodationType || "Habitación en alojamiento entero"}
            onValueChange={(value) => updateField("accommodationType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de alojamiento" />
            </SelectTrigger>
            <SelectContent>
              {accommodationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>Especifica qué tipo de alojamiento ofreces a los huéspedes</FormDescription>
        </div>

        {/* Grid de Capacidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Máximo de Huéspedes */}
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Huéspedes
            </FormLabel>
            <Input
              type="number"
              min="1"
              max="20"
              placeholder="4"
              value={formData.capacity?.maxGuests || 4}
              onChange={(e) => updateNestedField("capacity", "maxGuests", Number(e.target.value) || 1)}
            />
            <FormDescription className="text-xs">Máximo de huéspedes</FormDescription>
          </div>

          {/* Número de Camas */}
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-green-600" />
              Camas
            </FormLabel>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              value={formData.capacity?.beds || 1}
              onChange={(e) => updateNestedField("capacity", "beds", Number(e.target.value) || 1)}
            />
            <FormDescription className="text-xs">Número de camas</FormDescription>
          </div>

          {/* Número de Habitaciones */}
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Home className="h-4 w-4 text-purple-600" />
              Habitaciones
            </FormLabel>
            <Input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              value={formData.capacity?.bedrooms || 1}
              onChange={(e) => updateNestedField("capacity", "bedrooms", Number(e.target.value) || 1)}
            />
            <FormDescription className="text-xs">Número de habitaciones</FormDescription>
          </div>

          {/* Número de Baños */}
          <div className="space-y-2">
            <FormLabel className="flex items-center gap-2">
              <Bath className="h-4 w-4 text-cyan-600" />
              Baños
            </FormLabel>
            <Input
              type="number"
              min="1"
              max="10"
              step="0.5"
              placeholder="1"
              value={formData.capacity?.bathrooms || 1}
              onChange={(e) =>
                updateNestedField("capacity", "bathrooms", Number(Number.parseFloat(e.target.value)) || 1)
              }
            />
            <FormDescription className="text-xs">Número de baños (ej: 1.5)</FormDescription>
          </div>
        </div>

        {/* Información Visual */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-medium text-orange-800 mb-2">Vista Previa de Capacidad</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-orange-700">
              <Users className="h-4 w-4" />
              <span>{formData.capacity?.maxGuests || 4} huéspedes</span>
            </div>
            <div className="flex items-center gap-2 text-orange-700">
              <Bed className="h-4 w-4" />
              <span>
                {formData.capacity?.beds || 1} cama{(formData.capacity?.beds || 1) > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-orange-700">
              <Home className="h-4 w-4" />
              <span>
                {formData.capacity?.bedrooms || 1} habitación
                {(formData.capacity?.bedrooms || 1) > 1 ? "es" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-orange-700">
              <Bath className="h-4 w-4" />
              <span>
                {formData.capacity?.bathrooms || 1} baño{(formData.capacity?.bathrooms || 1) > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-orange-600">
            <strong>Tipo:</strong> {formData.accommodationType || "No especificado"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CapacityInfoFields

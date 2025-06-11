"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormContext } from "react-hook-form"
import { Users, Bed, Home, Bath } from "lucide-react"

const CapacityFields = () => {
  const form = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-blue-600" />
          Tipo de Alojamiento y Capacidad
        </CardTitle>
        <p className="text-sm text-muted-foreground">Configure el tipo de alojamiento y la capacidad de huéspedes</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Alojamiento */}
        <FormField
          control={form.control}
          name="accommodationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Alojamiento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "Habitación en alojamiento entero"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de alojamiento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Habitación en alojamiento entero">Habitación en alojamiento entero</SelectItem>
                  <SelectItem value="Habitación privada">Habitación privada</SelectItem>
                  <SelectItem value="Habitación compartida">Habitación compartida</SelectItem>
                  <SelectItem value="Casa completa">Casa completa</SelectItem>
                  <SelectItem value="Apartamento completo">Apartamento completo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos de Capacidad */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="capacity.maxGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  Máximo Huéspedes
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    {...field}
                    value={field.value || 4}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 4)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity.beds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-purple-600" />
                  Camas
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    {...field}
                    value={field.value || 1}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity.bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-orange-600" />
                  Habitaciones
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    {...field}
                    value={field.value || 1}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity.bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-blue-600" />
                  Baños
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    {...field}
                    value={field.value || 1}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Vista previa */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Vista previa:</strong> {form.watch("accommodationType") || "Habitación en alojamiento entero"} •
            Máximo {form.watch("capacity.maxGuests") || 4} huéspedes • {form.watch("capacity.beds") || 1} cama
            {(form.watch("capacity.beds") || 1) > 1 ? "s" : ""} • {form.watch("capacity.bedrooms") || 1} habitación
            {(form.watch("capacity.bedrooms") || 1) > 1 ? "es" : ""} • {form.watch("capacity.bathrooms") || 1} baño
            {(form.watch("capacity.bathrooms") || 1) > 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CapacityFields

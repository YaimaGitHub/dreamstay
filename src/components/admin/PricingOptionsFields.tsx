"use client"

import React from "react"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"
import type { RoomFormValues } from "./RoomFormSchema"

const PricingOptionsFields = () => {
  const form = useFormContext<RoomFormValues>()

  // Inicializar valores si no existen
  const initializeField = (path: string, defaultValue: any) => {
    const value = form.watch(path as any)
    if (value === undefined) {
      form.setValue(path as any, defaultValue)
    }
  }

  // Inicializar estructura de pricing si no existe
  React.useEffect(() => {
    initializeField("pricing", {})
    initializeField("pricing.nationalTourism", { enabled: false })
    initializeField("pricing.nationalTourism.nightlyRate", { enabled: false, price: 0 })
    initializeField("pricing.nationalTourism.hourlyRate", { enabled: false, price: 0 })
    initializeField("pricing.internationalTourism", { enabled: false })
    initializeField("pricing.internationalTourism.nightlyRate", { enabled: false, price: 0 })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Opciones de Precios
          <Badge variant="secondary">Avanzado</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Configure precios diferenciados según el tipo de turismo</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Turismo Nacional */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Turismo Nacional</h4>
              <p className="text-sm text-green-600">Precios para visitantes nacionales</p>
            </div>
            <FormField
              control={form.control}
              name="pricing.nationalTourism.enabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.watch("pricing.nationalTourism.enabled") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 border-l-4 border-green-200">
              {/* Precio por noche nacional */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium flex items-center gap-2">🌙 Por noche</FormLabel>
                  <FormField
                    control={form.control}
                    name="pricing.nationalTourism.nightlyRate.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("pricing.nationalTourism.nightlyRate.enabled") && (
                  <FormField
                    control={form.control}
                    name="pricing.nationalTourism.nightlyRate.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Precio por hora nacional */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium flex items-center gap-2">⏰ Por hora</FormLabel>
                  <FormField
                    control={form.control}
                    name="pricing.nationalTourism.hourlyRate.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("pricing.nationalTourism.hourlyRate.enabled") && (
                  <FormField
                    control={form.control}
                    name="pricing.nationalTourism.hourlyRate.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Turismo Internacional */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Globe className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800">Turismo Internacional</h4>
              <p className="text-sm text-blue-600">Precios para visitantes internacionales</p>
            </div>
            <FormField
              control={form.control}
              name="pricing.internationalTourism.enabled"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.watch("pricing.internationalTourism.enabled") && (
            <div className="pl-6 border-l-4 border-blue-200">
              {/* Solo precio por noche internacional */}
              <div className="space-y-3 max-w-md">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium flex items-center gap-2">🌙 Por noche</FormLabel>
                  <FormField
                    control={form.control}
                    name="pricing.internationalTourism.nightlyRate.enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("pricing.internationalTourism.nightlyRate.enabled") && (
                  <FormField
                    control={form.control}
                    name="pricing.internationalTourism.nightlyRate.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              value={field.value || 0}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
              <span className="text-amber-600 text-xs">ℹ</span>
            </div>
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Configuración de precios:</p>
              <ul className="space-y-1 text-xs">
                <li>• Si no configura precios específicos, se usará el precio base</li>
                <li>• Los precios por tipo de turismo tienen prioridad sobre el precio base</li>
                <li>• Turismo Nacional: Puede configurar precios por noche y por hora</li>
                <li>• Turismo Internacional: Solo precios por noche</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingOptionsFields

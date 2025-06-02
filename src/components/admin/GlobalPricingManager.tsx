"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Globe, Home, Info, RefreshCcw } from "lucide-react"
import { useGlobalPricing } from "@/contexts/GlobalPricingContext"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { generateGlobalPricingTypeScript } from "@/hooks/use-global-pricing"
import { useDataStore } from "@/hooks/use-data-store"

export function GlobalPricingManager() {
  const { globalConfig, updateGlobalConfig, isGlobalPricingActive, resetGlobalConfig } = useGlobalPricing()
  const { rooms } = useDataStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  const handleGlobalToggle = (enabled: boolean) => {
    updateGlobalConfig({ enabled })
  }

  const handleApplyToAllToggle = (applyToAllRooms: boolean) => {
    updateGlobalConfig({ applyToAllRooms })
  }

  const handleTourismTypeToggle = (type: "national" | "international", enabled: boolean) => {
    updateGlobalConfig({
      [type]: {
        ...globalConfig[type],
        enabled,
      },
    })
  }

  const handlePricingOptionToggle = (
    type: "national" | "international",
    option: "byNight" | "byHour",
    enabled: boolean,
  ) => {
    updateGlobalConfig({
      [type]: {
        ...globalConfig[type],
        [option]: {
          ...globalConfig[type][option],
          enabled,
        },
      },
    })
  }

  const handleMultiplierToggle = (
    type: "national" | "international",
    option: "byNight" | "byHour",
    useMultiplier: boolean,
  ) => {
    updateGlobalConfig({
      [type]: {
        ...globalConfig[type],
        [option]: {
          ...globalConfig[type][option],
          useMultiplier,
        },
      },
    })
  }

  const handleMultiplierChange = (
    type: "national" | "international",
    option: "byNight" | "byHour",
    multiplier: number,
  ) => {
    updateGlobalConfig({
      [type]: {
        ...globalConfig[type],
        [option]: {
          ...globalConfig[type][option],
          multiplier,
        },
      },
    })
  }

  const handleFixedPriceChange = (
    type: "national" | "international",
    option: "byNight" | "byHour",
    fixedPrice: number,
  ) => {
    updateGlobalConfig({
      [type]: {
        ...globalConfig[type],
        [option]: {
          ...globalConfig[type][option],
          fixedPrice,
        },
      },
    })
  }

  const handleExportConfig = () => {
    const tsCode = generateGlobalPricingTypeScript(globalConfig)

    // Crear un blob con el código TypeScript
    const blob = new Blob([tsCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Crear un enlace para descargar el archivo
    const a = document.createElement("a")
    a.href = url
    a.download = "global-pricing.ts"
    document.body.appendChild(a)
    a.click()

    // Limpiar
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Configuración exportada",
      description: "El archivo global-pricing.ts ha sido generado correctamente",
    })
  }

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas restablecer la configuración global de precios?")) {
      resetGlobalConfig()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Configuración Global de Precios</CardTitle>
            <CardDescription>Configura precios que se aplicarán a todas las habitaciones</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="global-pricing-enabled" checked={globalConfig.enabled} onCheckedChange={handleGlobalToggle} />
            <Label htmlFor="global-pricing-enabled">{globalConfig.enabled ? "Activado" : "Desactivado"}</Label>
          </div>
        </div>
      </CardHeader>

      {globalConfig.enabled && (
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription>
              La configuración global de precios tiene prioridad sobre los precios individuales de las habitaciones.
              {rooms.length > 0 && (
                <span className="block mt-2">
                  Esta configuración afectará a <strong>{rooms.length} habitaciones</strong> en la plataforma.
                </span>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex items-center space-x-2 mb-6">
            <Switch id="apply-to-all" checked={globalConfig.applyToAllRooms} onCheckedChange={handleApplyToAllToggle} />
            <Label htmlFor="apply-to-all">Aplicar a todas las habitaciones</Label>
            {globalConfig.applyToAllRooms && (
              <Badge variant="outline" className="ml-2 bg-green-50">
                <Check className="h-3 w-3 mr-1" /> Activo
              </Badge>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">
                <Home className="h-4 w-4 mr-2" />
                Turismo Nacional
              </TabsTrigger>
              <TabsTrigger value="international">
                <Globe className="h-4 w-4 mr-2" />
                Turismo Internacional
              </TabsTrigger>
            </TabsList>

            {/* Turismo Nacional */}
            <TabsContent value="general">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Turismo Nacional</h3>
                    <p className="text-sm text-muted-foreground">Configura precios para turistas nacionales</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="national-enabled"
                      checked={globalConfig.national.enabled}
                      onCheckedChange={(checked) => handleTourismTypeToggle("national", checked)}
                    />
                    <Label htmlFor="national-enabled">
                      {globalConfig.national.enabled ? "Activado" : "Desactivado"}
                    </Label>
                  </div>
                </div>

                {globalConfig.national.enabled && (
                  <>
                    {/* Por Noche */}
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Precio por Noche</h4>
                          <p className="text-sm text-muted-foreground">Configura el precio para estancias por noche</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="national-bynight-enabled"
                            checked={globalConfig.national.byNight.enabled}
                            onCheckedChange={(checked) => handlePricingOptionToggle("national", "byNight", checked)}
                          />
                          <Label htmlFor="national-bynight-enabled">
                            {globalConfig.national.byNight.enabled ? "Activado" : "Desactivado"}
                          </Label>
                        </div>
                      </div>

                      {globalConfig.national.byNight.enabled && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="national-bynight-multiplier"
                              checked={globalConfig.national.byNight.useMultiplier}
                              onCheckedChange={(checked) => handleMultiplierToggle("national", "byNight", checked)}
                            />
                            <Label htmlFor="national-bynight-multiplier">
                              Usar multiplicador (en vez de precio fijo)
                            </Label>
                          </div>

                          {globalConfig.national.byNight.useMultiplier ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="national-bynight-multiplier-value">Multiplicador</Label>
                                <div className="flex items-center">
                                  <Input
                                    id="national-bynight-multiplier-value"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={globalConfig.national.byNight.multiplier}
                                    onChange={(e) =>
                                      handleMultiplierChange("national", "byNight", Number.parseFloat(e.target.value))
                                    }
                                  />
                                  <span className="ml-2">x</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  El precio base se multiplicará por este valor
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Habitación de $100 → ${(100 * globalConfig.national.byNight.multiplier).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="national-bynight-fixed">Precio Fijo</Label>
                                <div className="flex items-center">
                                  <span className="mr-2">$</span>
                                  <Input
                                    id="national-bynight-fixed"
                                    type="number"
                                    min="0"
                                    value={globalConfig.national.byNight.fixedPrice}
                                    onChange={(e) =>
                                      handleFixedPriceChange("national", "byNight", Number.parseInt(e.target.value))
                                    }
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Este precio se aplicará a todas las habitaciones
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Todas las habitaciones → ${globalConfig.national.byNight.fixedPrice}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Por Hora */}
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Precio por Hora</h4>
                          <p className="text-sm text-muted-foreground">Configura el precio para estancias por hora</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="national-byhour-enabled"
                            checked={globalConfig.national.byHour.enabled}
                            onCheckedChange={(checked) => handlePricingOptionToggle("national", "byHour", checked)}
                          />
                          <Label htmlFor="national-byhour-enabled">
                            {globalConfig.national.byHour.enabled ? "Activado" : "Desactivado"}
                          </Label>
                        </div>
                      </div>

                      {globalConfig.national.byHour.enabled && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="national-byhour-multiplier"
                              checked={globalConfig.national.byHour.useMultiplier}
                              onCheckedChange={(checked) => handleMultiplierToggle("national", "byHour", checked)}
                            />
                            <Label htmlFor="national-byhour-multiplier">
                              Usar multiplicador (en vez de precio fijo)
                            </Label>
                          </div>

                          {globalConfig.national.byHour.useMultiplier ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="national-byhour-multiplier-value">Multiplicador</Label>
                                <div className="flex items-center">
                                  <Input
                                    id="national-byhour-multiplier-value"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={globalConfig.national.byHour.multiplier}
                                    onChange={(e) =>
                                      handleMultiplierChange("national", "byHour", Number.parseFloat(e.target.value))
                                    }
                                  />
                                  <span className="ml-2">x</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  El precio base se multiplicará por este valor
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Habitación de $100 → ${(100 * globalConfig.national.byHour.multiplier).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="national-byhour-fixed">Precio Fijo</Label>
                                <div className="flex items-center">
                                  <span className="mr-2">$</span>
                                  <Input
                                    id="national-byhour-fixed"
                                    type="number"
                                    min="0"
                                    value={globalConfig.national.byHour.fixedPrice}
                                    onChange={(e) =>
                                      handleFixedPriceChange("national", "byHour", Number.parseInt(e.target.value))
                                    }
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Este precio se aplicará a todas las habitaciones
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Todas las habitaciones → ${globalConfig.national.byHour.fixedPrice}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Turismo Internacional */}
            <TabsContent value="international">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Turismo Internacional</h3>
                    <p className="text-sm text-muted-foreground">Configura precios para turistas internacionales</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="international-enabled"
                      checked={globalConfig.international.enabled}
                      onCheckedChange={(checked) => handleTourismTypeToggle("international", checked)}
                    />
                    <Label htmlFor="international-enabled">
                      {globalConfig.international.enabled ? "Activado" : "Desactivado"}
                    </Label>
                  </div>
                </div>

                {globalConfig.international.enabled && (
                  <>
                    {/* Por Noche */}
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Precio por Noche</h4>
                          <p className="text-sm text-muted-foreground">Configura el precio para estancias por noche</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="international-bynight-enabled"
                            checked={globalConfig.international.byNight.enabled}
                            onCheckedChange={(checked) =>
                              handlePricingOptionToggle("international", "byNight", checked)
                            }
                          />
                          <Label htmlFor="international-bynight-enabled">
                            {globalConfig.international.byNight.enabled ? "Activado" : "Desactivado"}
                          </Label>
                        </div>
                      </div>

                      {globalConfig.international.byNight.enabled && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="international-bynight-multiplier"
                              checked={globalConfig.international.byNight.useMultiplier}
                              onCheckedChange={(checked) => handleMultiplierToggle("international", "byNight", checked)}
                            />
                            <Label htmlFor="international-bynight-multiplier">
                              Usar multiplicador (en vez de precio fijo)
                            </Label>
                          </div>

                          {globalConfig.international.byNight.useMultiplier ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="international-bynight-multiplier-value">Multiplicador</Label>
                                <div className="flex items-center">
                                  <Input
                                    id="international-bynight-multiplier-value"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={globalConfig.international.byNight.multiplier}
                                    onChange={(e) =>
                                      handleMultiplierChange(
                                        "international",
                                        "byNight",
                                        Number.parseFloat(e.target.value),
                                      )
                                    }
                                  />
                                  <span className="ml-2">x</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  El precio base se multiplicará por este valor
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Habitación de $100 → $
                                  {(100 * globalConfig.international.byNight.multiplier).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="international-bynight-fixed">Precio Fijo</Label>
                                <div className="flex items-center">
                                  <span className="mr-2">$</span>
                                  <Input
                                    id="international-bynight-fixed"
                                    type="number"
                                    min="0"
                                    value={globalConfig.international.byNight.fixedPrice}
                                    onChange={(e) =>
                                      handleFixedPriceChange(
                                        "international",
                                        "byNight",
                                        Number.parseInt(e.target.value),
                                      )
                                    }
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Este precio se aplicará a todas las habitaciones
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Todas las habitaciones → ${globalConfig.international.byNight.fixedPrice}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Por Hora */}
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Precio por Hora</h4>
                          <p className="text-sm text-muted-foreground">Configura el precio para estancias por hora</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="international-byhour-enabled"
                            checked={globalConfig.international.byHour.enabled}
                            onCheckedChange={(checked) => handlePricingOptionToggle("international", "byHour", checked)}
                          />
                          <Label htmlFor="international-byhour-enabled">
                            {globalConfig.international.byHour.enabled ? "Activado" : "Desactivado"}
                          </Label>
                        </div>
                      </div>

                      {globalConfig.international.byHour.enabled && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="international-byhour-multiplier"
                              checked={globalConfig.international.byHour.useMultiplier}
                              onCheckedChange={(checked) => handleMultiplierToggle("international", "byHour", checked)}
                            />
                            <Label htmlFor="international-byhour-multiplier">
                              Usar multiplicador (en vez de precio fijo)
                            </Label>
                          </div>

                          {globalConfig.international.byHour.useMultiplier ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="international-byhour-multiplier-value">Multiplicador</Label>
                                <div className="flex items-center">
                                  <Input
                                    id="international-byhour-multiplier-value"
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={globalConfig.international.byHour.multiplier}
                                    onChange={(e) =>
                                      handleMultiplierChange(
                                        "international",
                                        "byHour",
                                        Number.parseFloat(e.target.value),
                                      )
                                    }
                                  />
                                  <span className="ml-2">x</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  El precio base se multiplicará por este valor
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Habitación de $100 → $
                                  {(100 * globalConfig.international.byHour.multiplier).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="international-byhour-fixed">Precio Fijo</Label>
                                <div className="flex items-center">
                                  <span className="mr-2">$</span>
                                  <Input
                                    id="international-byhour-fixed"
                                    type="number"
                                    min="0"
                                    value={globalConfig.international.byHour.fixedPrice}
                                    onChange={(e) =>
                                      handleFixedPriceChange("international", "byHour", Number.parseInt(e.target.value))
                                    }
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Este precio se aplicará a todas las habitaciones
                                </p>
                              </div>
                              <div className="rounded-md bg-muted p-3">
                                <h5 className="text-sm font-medium mb-1">Ejemplo:</h5>
                                <p className="text-sm">
                                  Todas las habitaciones → ${globalConfig.international.byHour.fixedPrice}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}

      <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
        <div className="flex items-center">
          {isGlobalPricingActive ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <Check className="h-3 w-3 mr-1" /> Configuración global activa
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100">
              <AlertCircle className="h-3 w-3 mr-1" /> Configuración global inactiva
            </Badge>
          )}

          {globalConfig.lastUpdated && (
            <span className="text-xs text-muted-foreground ml-3">
              Última actualización: {new Date(globalConfig.lastUpdated).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Restablecer
          </Button>
          <Button size="sm" onClick={handleExportConfig}>
            Exportar configuración
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

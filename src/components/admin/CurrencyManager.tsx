"use client"

import { useState } from "react"
import { useCurrencyLanguage, type Currency } from "@/contexts/CurrencyLanguageContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Download, Upload, Save, RefreshCw, AlertCircle, DollarSign, Clock, Loader2, FileJson } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRoomStore } from "@/contexts/RoomStoreContext"

export function CurrencyManager() {
  const { currencies, updateCurrencyRate, toggleCurrencyEnabled, exportCurrencyConfig, importCurrencyConfig } =
    useCurrencyLanguage()

  const { saveToFile, exportData } = useRoomStore()

  const [editedRates, setEditedRates] = useState<Record<Currency, string>>(() => {
    const rates: Record<string, string> = {}
    currencies.forEach((c) => {
      rates[c.code] = c.rate.toString()
    })
    return rates as Record<Currency, string>
  })

  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Manejar cambio en el input de tasa de cambio
  const handleRateChange = (currency: Currency, value: string) => {
    setEditedRates((prev) => ({
      ...prev,
      [currency]: value,
    }))
  }

  // Aplicar cambios de tasas
  const handleApplyRates = () => {
    setIsUpdating(true)

    try {
      Object.entries(editedRates).forEach(([code, rateStr]) => {
        const rate = Number.parseFloat(rateStr)
        if (!isNaN(rate) && rate > 0) {
          updateCurrencyRate(code as Currency, rate)
        }
      })

      setLastUpdated(new Date())
      toast.success("Tasas de cambio actualizadas correctamente")

      // Guardar cambios en el archivo
      if (saveToFile) {
        saveToFile().then((success) => {
          if (success) {
            toast.success("Configuración guardada en archivo")
          }
        })
      }
    } catch (error) {
      console.error("Error al actualizar tasas:", error)
      toast.error("Error al actualizar las tasas de cambio")
    } finally {
      setIsUpdating(false)
    }
  }

  // Exportar configuración
  const handleExportConfig = () => {
    setIsExporting(true)

    try {
      const config = exportCurrencyConfig()
      const blob = new Blob([config], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `currency-config-${format(new Date(), "yyyyMMdd")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
      toast.success("Configuración de monedas exportada correctamente")

      // También exportar datos completos si está disponible
      if (exportData) {
        exportData()
      }
    } catch (error) {
      console.error("Error al exportar configuración:", error)
      toast.error("Error al exportar la configuración de monedas")
    } finally {
      setIsExporting(false)
    }
  }

  // Importar configuración
  const handleImportConfig = async () => {
    setIsImporting(true)

    try {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "application/json"

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          setIsImporting(false)
          return
        }

        const reader = new FileReader()
        reader.onload = async (event) => {
          const content = event.target?.result as string
          if (content) {
            const success = importCurrencyConfig(content)

            if (success) {
              toast.success("Configuración de monedas importada correctamente")

              // Actualizar los inputs con las nuevas tasas
              const updatedRates: Record<string, string> = {}
              currencies.forEach((c) => {
                updatedRates[c.code] = c.rate.toString()
              })
              setEditedRates(updatedRates as Record<Currency, string>)

              setLastUpdated(new Date())

              // Guardar cambios en el archivo
              if (saveToFile) {
                const saved = await saveToFile()
                if (saved) {
                  toast.success("Configuración guardada en archivo")
                }
              }
            } else {
              toast.error("Error al importar la configuración. Formato inválido.")
            }
          }
          setIsImporting(false)
        }

        reader.readAsText(file)
      }

      input.click()
    } catch (error) {
      console.error("Error al importar configuración:", error)
      toast.error("Error al importar la configuración de monedas")
      setIsImporting(false)
    }
  }

  // Actualizar tasas desde el mercado informal (simulado)
  const handleUpdateFromMarket = () => {
    setIsUpdating(true)

    // Simulamos una actualización desde una API externa
    setTimeout(() => {
      try {
        // Estos serían los valores obtenidos de una API externa
        const marketRates: Partial<Record<Currency, number>> = {
          USD: 373,
          EUR: 395,
          MLC: 260,
          CAD: 240,
          MXN: 19,
          ZELLE: 366,
        }

        // Actualizar las tasas
        Object.entries(marketRates).forEach(([code, rate]) => {
          if (rate) {
            updateCurrencyRate(code as Currency, rate)
            setEditedRates((prev) => ({
              ...prev,
              [code]: rate.toString(),
            }))
          }
        })

        setLastUpdated(new Date())
        toast.success("Tasas actualizadas desde el mercado informal")

        // Guardar cambios en el archivo
        if (saveToFile) {
          saveToFile().then((success) => {
            if (success) {
              toast.success("Configuración guardada en archivo")
            }
          })
        }
      } catch (error) {
        console.error("Error al actualizar desde el mercado:", error)
        toast.error("Error al actualizar desde el mercado informal")
      } finally {
        setIsUpdating(false)
      }
    }, 1500)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-slate-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Gestor de Monedas
            </CardTitle>
            <CardDescription>Administre las tasas de cambio y monedas disponibles en la plataforma</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-sm flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {lastUpdated ? format(lastUpdated, "d 'de' MMMM, HH:mm", { locale: es }) : "No actualizado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>
            Las tasas de cambio se basan en el mercado informal de divisas en Cuba. Actualice regularmente para mantener
            los precios correctos.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tasas de Cambio</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdateFromMarket}
              disabled={isUpdating}
              className="flex items-center gap-1"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Actualizar del mercado
            </Button>
          </div>

          <div className="grid gap-4">
            {currencies.map((currency) => (
              <div key={currency.code} className="flex items-center justify-between p-3 border rounded-md bg-white">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={currency.enabled}
                    onCheckedChange={() => toggleCurrencyEnabled(currency.code)}
                    disabled={currency.code === "CUP"} // CUP siempre habilitado
                  />
                  <div>
                    <p className="font-medium">
                      {currency.name} ({currency.code})
                    </p>
                    <p className="text-sm text-muted-foreground">Símbolo: {currency.symbol}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Label htmlFor={`rate-${currency.code}`} className="mr-2 whitespace-nowrap">
                      1 {currency.code} =
                    </Label>
                    <div className="relative">
                      <Input
                        id={`rate-${currency.code}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={editedRates[currency.code]}
                        onChange={(e) => handleRateChange(currency.code, e.target.value)}
                        className="w-24 pr-10"
                        disabled={currency.code === "CUP"} // CUP siempre es 1
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground">CUP</span>
                    </div>
                  </div>

                  {currency.code === "CUP" && (
                    <Badge variant="outline" className="ml-2">
                      Moneda base
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t pt-4 bg-slate-50">
        <Button variant="default" className="flex items-center gap-2" onClick={handleApplyRates} disabled={isUpdating}>
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Aplicar cambios
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExportConfig}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exportar configuración
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleImportConfig}
          disabled={isImporting}
        >
          {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Importar configuración
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            if (saveToFile) {
              saveToFile().then((success) => {
                if (success) {
                  toast.success("Configuración guardada en archivo")
                }
              })
            }
          }}
        >
          <FileJson className="h-4 w-4" />
          Guardar en archivo
        </Button>
      </CardFooter>
    </Card>
  )
}

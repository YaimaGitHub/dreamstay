"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCurrencyLanguage } from "@/contexts/CurrencyLanguageContext"
import { AdminLayout } from "@/components/AdminLayout"

const CurrencySettings: React.FC = () => {
  const {
    currencies,
    updateCurrencyRate,
    toggleCurrencyEnabled,
    exportCurrencyConfig,
    selectedCurrency,
    setSelectedCurrency,
  } = useCurrencyLanguage()

  const handleRateChange = (currencyCode: string, value: string) => {
    const rate = Number.parseFloat(value)
    if (!isNaN(rate) && rate > 0) {
      updateCurrencyRate(currencyCode, rate)
    }
  }

  const updateFromMarket = () => {
    // Simulate updating from informal market rates
    const marketRates = {
      USD: 373,
      EUR: 395,
      MLC: 260,
      CAD: 240,
      MXN: 19,
      ZELLE: 366,
    }

    Object.entries(marketRates).forEach(([code, rate]) => {
      updateCurrencyRate(code, rate)
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Monedas</h1>
          <Button onClick={updateFromMarket}>Actualizar desde Mercado Informal</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Moneda por Defecto</CardTitle>
            <CardDescription>Selecciona la moneda que se mostrará por defecto en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {Object.values(currencies)
                .filter((c) => c.enabled)
                .map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
            </select>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {Object.entries(currencies).map(([code, currency]) => (
            <Card key={code}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {currency.name} ({currency.code})
                    </CardTitle>
                    <CardDescription>Símbolo: {currency.symbol}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`enabled-${code}`}>Habilitada</Label>
                    <Switch
                      id={`enabled-${code}`}
                      checked={currency.enabled}
                      onCheckedChange={(checked) => toggleCurrencyEnabled(code, checked)}
                      disabled={code === "CUP"} // CUP cannot be disabled
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor={`rate-${code}`}>Tasa de Cambio (1 {code} = X CUP)</Label>
                    <Input
                      id={`rate-${code}`}
                      type="number"
                      step="0.01"
                      value={currency.rate}
                      onChange={(e) => handleRateChange(code, e.target.value)}
                      disabled={code === "CUP"} // CUP rate is always 1
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    1 {code} = {currency.rate.toFixed(2)} CUP
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>Exportar o importar configuración de monedas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportCurrencyConfig} className="w-full">
              Exportar Configuración
            </Button>
            <p className="text-sm text-muted-foreground">
              La configuración se guardará en el código fuente generado para persistir los cambios.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default CurrencySettings

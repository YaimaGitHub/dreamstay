"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppInput } from "@/components/ui/whatsapp-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Phone } from "lucide-react"

export const WhatsAppValidationDemo: React.FC = () => {
  const [number, setNumber] = useState("")
  const [isValid, setIsValid] = useState(false)

  const testNumbers = ["+1234567890", "+34123456789", "+52123456789", "+18095551234", "+18295551234", "+18495551234"]

  const handleTestNumber = (testNumber: string) => {
    setNumber(testNumber)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Validación de WhatsApp en Tiempo Real
        </CardTitle>
        <CardDescription>Prueba la validación automática de números de WhatsApp con detección de país</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input principal */}
        <WhatsAppInput
          value={number}
          onChange={setNumber}
          onValidationChange={setIsValid}
          label="Número de WhatsApp"
          description="El número se formatea y valida automáticamente"
        />

        {/* Estado de validación */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Estado:</span>
          <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
            {isValid ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Válido
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Inválido
              </>
            )}
          </Badge>
        </div>

        {/* Números de prueba */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Números de prueba:</h4>
          <div className="grid grid-cols-2 gap-2">
            {testNumbers.map((testNumber) => (
              <Button
                key={testNumber}
                variant="outline"
                size="sm"
                onClick={() => handleTestNumber(testNumber)}
                className="justify-start text-xs"
              >
                {testNumber}
              </Button>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-medium">Características:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Auto-formateo con código de país</li>
            <li>• Detección automática del país</li>
            <li>• Validación de longitud por país</li>
            <li>• Feedback visual en tiempo real</li>
            <li>• Soporte para 200+ países</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

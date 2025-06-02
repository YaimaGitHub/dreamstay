"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppInput } from "@/components/ui/whatsapp-input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface HostWhatsAppFieldsProps {
  primaryNumber: string
  secondaryNumber: string
  enabled: boolean
  onPrimaryChange: (value: string) => void
  onSecondaryChange: (value: string) => void
  onEnabledChange: (enabled: boolean) => void
  isPrimaryValid: boolean
  isSecondaryValid: boolean
  setPrimaryValid: (valid: boolean) => void
  setSecondaryValid: (valid: boolean) => void
}

const HostWhatsAppFields: React.FC<HostWhatsAppFieldsProps> = ({
  primaryNumber,
  secondaryNumber,
  enabled,
  onPrimaryChange,
  onSecondaryChange,
  onEnabledChange,
  isPrimaryValid,
  isSecondaryValid,
  setPrimaryValid,
  setSecondaryValid,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de WhatsApp</CardTitle>
        <CardDescription>Configura los números de WhatsApp de los anfitriones para esta habitación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="whatsapp-enabled" checked={enabled} onCheckedChange={onEnabledChange} />
          <Label htmlFor="whatsapp-enabled">{enabled ? "WhatsApp habilitado" : "WhatsApp deshabilitado"}</Label>
        </div>

        {enabled && (
          <div className="space-y-4 mt-4">
            <WhatsAppInput
              label="Número de WhatsApp Principal"
              value={primaryNumber}
              onChange={onPrimaryChange}
              onValidationChange={setPrimaryValid}
              required={true}
              description="Este número recibirá todas las notificaciones de reservas"
              disabled={!enabled}
            />

            <WhatsAppInput
              label="Número de WhatsApp Secundario (Opcional)"
              value={secondaryNumber}
              onChange={onSecondaryChange}
              onValidationChange={setSecondaryValid}
              description="Número adicional para recibir notificaciones"
              disabled={!enabled}
            />

            {enabled && !isPrimaryValid && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  El número de WhatsApp principal es obligatorio y debe ser válido para habilitar las notificaciones.
                </AlertDescription>
              </Alert>
            )}

            {enabled && secondaryNumber && !isSecondaryValid && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  El número de WhatsApp secundario no es válido. Corríjalo o déjelo en blanco.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HostWhatsAppFields

"use client"

import { useState } from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsAppInput } from "@/components/ui/whatsapp-input"
import { MessageCircle, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFormContext } from "react-hook-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const WhatsAppConfigFields = () => {
  const form = useFormContext()
  const whatsappEnabled = form.watch("hostWhatsApp.enabled") || false
  const primaryNumber = form.watch("hostWhatsApp.primary") || ""
  const secondaryNumber = form.watch("hostWhatsApp.secondary") || ""

  const [primaryValid, setPrimaryValid] = useState(false)
  const [secondaryValid, setSecondaryValid] = useState(false)

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <CardTitle>Configuración de WhatsApp</CardTitle>
          </div>
          <FormField
            control={form.control}
            name="hostWhatsApp.enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Habilitar WhatsApp</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <CardDescription>
          Configure los números de WhatsApp para recibir notificaciones de reservas para esta habitación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {whatsappEnabled ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium">Anfitrión Principal</h3>
                <span className="text-red-500">*</span>
              </div>

              <FormField
                control={form.control}
                name="hostWhatsApp.primary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de WhatsApp Principal</FormLabel>
                    <FormControl>
                      <WhatsAppInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onValidationChange={setPrimaryValid}
                        placeholder="+53 55555555"
                      />
                    </FormControl>
                    <div className="flex items-center justify-between mt-1">
                      <FormMessage />
                      {primaryNumber && (
                        <Badge variant={primaryValid ? "outline" : "destructive"} className="ml-auto">
                          {primaryValid ? "Válido" : "Inválido"}
                        </Badge>
                      )}
                    </div>
                    <FormDescription>Ingrese el número con código de país (ej: +53 para Cuba)</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostWhatsApp.sendToPrimary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!primaryValid} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enviar notificaciones a este número</FormLabel>
                      <FormDescription>Las reservas se enviarán a este número de WhatsApp</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <h3 className="text-sm font-medium">Anfitrión Secundario (Opcional)</h3>
              </div>

              <FormField
                control={form.control}
                name="hostWhatsApp.secondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de WhatsApp Secundario</FormLabel>
                    <FormControl>
                      <WhatsAppInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onValidationChange={setSecondaryValid}
                        placeholder="+53 55555555"
                      />
                    </FormControl>
                    <div className="flex items-center justify-between mt-1">
                      <FormMessage />
                      {secondaryNumber && (
                        <Badge variant={secondaryValid ? "outline" : "destructive"} className="ml-auto">
                          {secondaryValid ? "Válido" : "Inválido"}
                        </Badge>
                      )}
                    </div>
                    <FormDescription>Opcional: Ingrese un segundo número para notificaciones</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hostWhatsApp.sendToSecondary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!secondaryValid} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enviar notificaciones a este número</FormLabel>
                      <FormDescription>Las reservas también se enviarán a este número de WhatsApp</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle>Información importante</AlertTitle>
              <AlertDescription className="text-sm text-blue-700">
                Los mensajes de reserva se enviarán solo a los números seleccionados. Puede enviar a uno o ambos
                anfitriones según su preferencia. Asegúrese de que los números sean válidos y estén activos en WhatsApp.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">
              Habilite WhatsApp para configurar los números de anfitriones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WhatsAppConfigFields

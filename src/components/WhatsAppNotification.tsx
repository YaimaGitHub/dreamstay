"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Smartphone, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppNotificationProps {
  isVisible: boolean
  hostNumbers: {
    primary: string
    secondary?: string
  }
  roomTitle: string
  onComplete: () => void
}

const WhatsAppNotification = ({ isVisible, hostNumbers, roomTitle, onComplete }: WhatsAppNotificationProps) => {
  const [step, setStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (isVisible) {
      setStep(1)
      setCompletedSteps([])
    }
  }, [isVisible])

  const handleStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber])
    }

    // Determinar cuántos anfitriones hay
    const totalHosts = hostNumbers.secondary ? 2 : 1

    if (completedSteps.length + 1 >= totalHosts) {
      // Todos los pasos completados
      setTimeout(() => {
        setStep(3) // Ir al paso final
      }, 1000)
    } else if (stepNumber === 1 && hostNumbers.secondary) {
      // Si hay anfitrión secundario, ir al paso 2
      setTimeout(() => {
        setStep(2)
      }, 1000)
    }
  }

  const handleFinish = () => {
    onComplete()
  }

  if (!isVisible) return null

  const formatPhoneNumber = (phone: string) => {
    // Mostrar solo los últimos 4 dígitos para privacidad
    const clean = phone.replace(/[^\d]/g, "")
    if (clean.length > 4) {
      return `****${clean.slice(-4)}`
    }
    return phone
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Reserva Enviada
              </CardTitle>
              <CardDescription className="text-sm">
                Tu solicitud de reserva para <span className="font-medium">{roomTitle}</span> ha sido enviada por
                WhatsApp
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onComplete} className="h-8 w-8 p-0 -mt-2 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Paso 1: Anfitrión Principal */}
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300",
              step >= 1 ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50",
              completedSteps.includes(1) && "border-green-300 bg-green-100",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                completedSteps.includes(1)
                  ? "bg-green-600 text-white"
                  : step >= 1
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400",
              )}
            >
              {completedSteps.includes(1) ? <CheckCircle className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Anfitrión Principal</p>
                  <p className="text-xs text-muted-foreground">WhatsApp {formatPhoneNumber(hostNumbers.primary)}</p>
                </div>
                {step === 1 && !completedSteps.includes(1) && (
                  <Button
                    size="sm"
                    onClick={() => handleStepComplete(1)}
                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Abrir
                  </Button>
                )}
                {completedSteps.includes(1) && <span className="text-xs text-green-600 font-medium">✓ Enviado</span>}
              </div>
            </div>
          </div>

          {/* Paso 2: Anfitrión Secundario (si existe) */}
          {hostNumbers.secondary && (
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300",
                step >= 2 ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50",
                completedSteps.includes(2) && "border-green-300 bg-green-100",
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  completedSteps.includes(2)
                    ? "bg-green-600 text-white"
                    : step >= 2
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400",
                )}
              >
                {completedSteps.includes(2) ? <CheckCircle className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Anfitrión Secundario</p>
                    <p className="text-xs text-muted-foreground">WhatsApp {formatPhoneNumber(hostNumbers.secondary)}</p>
                  </div>
                  {step === 2 && !completedSteps.includes(2) && (
                    <Button
                      size="sm"
                      onClick={() => handleStepComplete(2)}
                      className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Abrir
                    </Button>
                  )}
                  {completedSteps.includes(2) && <span className="text-xs text-green-600 font-medium">✓ Enviado</span>}
                </div>
              </div>
            </div>
          )}

          {/* Paso Final: Confirmación */}
          {step === 3 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-green-800">¡Reserva Enviada!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Los anfitriones han recibido tu solicitud y se pondrán en contacto contigo pronto.
                </p>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          {step < 3 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Instrucciones:</strong> Haz clic en "Abrir" para enviar tu reserva por WhatsApp. Se abrirá la
                aplicación de WhatsApp con el mensaje pre-escrito. Solo envía el mensaje.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            {step < 3 ? (
              <>
                <Button variant="outline" onClick={onComplete} className="flex-1 h-10 text-sm">
                  Cancelar
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={completedSteps.length === 0}
                  className="flex-1 h-10 text-sm bg-green-600 hover:bg-green-700"
                >
                  {completedSteps.length > 0 ? "Finalizar" : "Enviar Primero"}
                </Button>
              </>
            ) : (
              <Button onClick={handleFinish} className="w-full h-10 bg-green-600 hover:bg-green-700">
                Entendido
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WhatsAppNotification

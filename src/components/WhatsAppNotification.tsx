"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Phone } from "lucide-react"

interface WhatsAppNotificationProps {
  isVisible: boolean
  hostNumbers: {
    primary: string
    secondary?: string
  }
  roomTitle?: string
  onComplete: () => void
}

const WhatsAppNotification = ({ isVisible, hostNumbers, roomTitle, onComplete }: WhatsAppNotificationProps) => {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setStep(0)
      setIsAnimating(true)

      // Secuencia de animación
      const timer1 = setTimeout(() => setStep(1), 500)
      const timer2 = setTimeout(() => setStep(2), 1500)
      const timer3 = setTimeout(() => setStep(3), 2500)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center space-y-6">
          {/* Icono animado */}
          <div className="relative">
            <div
              className={`w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center transition-all duration-500 ${
                isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <MessageCircle
                className={`h-8 w-8 text-green-600 transition-all duration-300 ${step >= 1 ? "scale-100" : "scale-0"}`}
              />
            </div>

            {/* Ondas de animación */}
            {step >= 1 && (
              <>
                <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-green-200 animate-ping opacity-75"></div>
                <div
                  className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-green-300 animate-ping opacity-50"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </>
            )}
          </div>

          {/* Título */}
          <div
            className={`transition-all duration-500 ${step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h3 className="text-xl font-bold text-gray-900">¡Reserva Enviada!</h3>
            <p className="text-gray-600 mt-2">
              Tu solicitud de reserva para {roomTitle ? `"${roomTitle}"` : "la habitación"} ha sido enviada a los
              anfitriones
            </p>
          </div>

          {/* Detalles de envío */}
          <div
            className={`space-y-3 transition-all duration-500 ${step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>Enviado a WhatsApp:</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Anfitrión principal: {hostNumbers.primary}</span>
              </div>

              {hostNumbers.secondary && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Anfitrión secundario: {hostNumbers.secondary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <div
            className={`transition-all duration-500 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">¿Qué sigue?</p>
              <p>
                Los anfitriones recibirán tu solicitud y te contactarán pronto para confirmar la disponibilidad y
                finalizar tu reserva.
              </p>
            </div>
          </div>

          {/* Botón de cerrar */}
          <div
            className={`transition-all duration-500 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Entendido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WhatsAppNotification

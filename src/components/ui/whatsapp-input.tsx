"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Loader2, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWhatsAppValidation } from "@/hooks/use-whatsapp-validation"

interface WhatsAppInputProps {
  value?: string
  onChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({
  value = "",
  onChange,
  onValidationChange,
  placeholder = "+53512345678",
  label = "Número de WhatsApp",
  description = "Ingrese el número con código de país",
  required = false,
  className,
  disabled = false,
}) => {
  const { value: inputValue, setValue, isValid, isValidating, error, country } = useWhatsAppValidation(value)

  // Notificar cambios al componente padre
  React.useEffect(() => {
    if (onChange && inputValue !== value) {
      onChange(inputValue)
    }
  }, [inputValue, onChange, value])

  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid)
    }
  }, [isValid, onValidationChange])

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    if (!inputValue || inputValue === "+") {
      return <Phone className="h-4 w-4 text-muted-foreground" />
    }

    if (isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }

    return <Phone className="h-4 w-4 text-muted-foreground" />
  }

  const getInputClassName = () => {
    if (!inputValue || inputValue === "+") return ""
    if (isValidating) return "border-blue-300 focus:border-blue-500"
    if (isValid) return "border-green-300 focus:border-green-500"
    if (error) return "border-red-300 focus:border-red-500"
    return ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          type="tel"
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10 transition-colors", getInputClassName())}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{getStatusIcon()}</div>
      </div>

      {/* Información del país */}
      {country && !error && inputValue && inputValue !== "+" && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>País detectado: {country}</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <XCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}

      {/* Descripción */}
      {description && !error && <p className="text-xs text-muted-foreground">{description}</p>}

      {/* Indicador de validación en tiempo real */}
      {isValidating && (
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Validando número...</span>
        </div>
      )}

      {/* Ayuda visual para el formato con ejemplos de países importantes */}
      {!inputValue && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            <strong>Ejemplos por región:</strong>
          </div>
          <div>🇨🇺 Cuba: +5351234567</div>
          <div>🇩🇴 Rep. Dominicana: +18095551234</div>
          <div>🇪🇸 España: +34612345678</div>
          <div>🇲🇽 México: +525512345678</div>
          <div>🇨🇴 Colombia: +5712345678</div>
          <div>🇦🇷 Argentina: +541123456789</div>
        </div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"

interface WhatsAppInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  placeholder?: string
  label?: string
  description?: string
  required?: boolean
}

export const WhatsAppInput = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "+53 55555555",
  label = "Número de WhatsApp",
  description,
  required = false,
}: WhatsAppInputProps) => {
  const [isValid, setIsValid] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Validar número de WhatsApp
  const validateWhatsAppNumber = (number: string) => {
    // Remover espacios y caracteres especiales excepto +
    const cleanNumber = number.replace(/[^\d+]/g, "")

    // Debe empezar con + y tener al menos 10 dígitos
    const regex = /^\+\d{10,15}$/
    return regex.test(cleanNumber)
  }

  // Formatear número de WhatsApp
  const formatWhatsAppNumber = (number: string) => {
    // Si está vacío, no formatear
    if (!number) return ""

    // Remover todos los caracteres no numéricos excepto +
    let cleaned = number.replace(/[^\d+]/g, "")

    // Si no empieza con +, agregarlo
    if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned
    }

    return cleaned
  }

  // Validar cuando cambia el valor
  useEffect(() => {
    const formattedValue = formatWhatsAppNumber(value)
    const valid = validateWhatsAppNumber(formattedValue)
    setIsValid(valid)

    // Notificar al componente padre sobre la validación
    if (onValidationChange) {
      onValidationChange(valid)
    }
  }, [value, onValidationChange])

  // Manejar cambio de valor
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(formatWhatsAppNumber(newValue))
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="whatsapp-input" className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id="whatsapp-input"
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-10 ${
            value && !isValid ? "border-red-500 focus:ring-red-500" : isFocused ? "border-green-500" : ""
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <MessageCircle
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            value && !isValid ? "text-red-500" : "text-green-600"
          }`}
        />
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {value && !isValid && (
        <p className="text-xs text-red-500">
          Formato inválido. Debe incluir código de país (ej: +53 para Cuba) y al menos 10 dígitos
        </p>
      )}
    </div>
  )
}

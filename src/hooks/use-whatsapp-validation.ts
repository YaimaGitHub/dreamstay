"use client"

import { useState, useEffect } from "react"

export const useWhatsAppValidation = (phoneNumber: string) => {
  const [isValid, setIsValid] = useState(false)
  const [formattedNumber, setFormattedNumber] = useState("")
  const [countryCode, setCountryCode] = useState("")

  useEffect(() => {
    const validateNumber = () => {
      // Si está vacío, no es válido
      if (!phoneNumber || phoneNumber.trim() === "") {
        setIsValid(false)
        setFormattedNumber("")
        setCountryCode("")
        return
      }

      // Limpiar el número (eliminar espacios, guiones, etc.)
      const cleanNumber = phoneNumber.replace(/\s+|-|$$|$$/g, "")

      // Debe empezar con + y tener al menos 10 dígitos
      const regex = /^\+\d{10,15}$/
      const valid = regex.test(cleanNumber)

      setIsValid(valid)

      if (valid) {
        // Extraer código de país
        const countryCodeMatch = cleanNumber.match(/^\+(\d{1,3})/)
        if (countryCodeMatch) {
          setCountryCode(countryCodeMatch[1])
        }

        // Formatear número
        setFormattedNumber(cleanNumber)
      }
    }

    validateNumber()
  }, [phoneNumber])

  return {
    isValid,
    formattedNumber,
    countryCode,
  }
}

export const validateWhatsAppNumber = (phoneNumber: string) => {
  // Si está vacío, no es válido
  if (!phoneNumber || phoneNumber.trim() === "") {
    return { isValid: false, formattedNumber: "", countryCode: "" }
  }

  // Limpiar el número (eliminar espacios, guiones, etc.)
  const cleanNumber = phoneNumber.replace(/\s+|-|$$|$$/g, "")

  // Debe empezar con + y tener al menos 10 dígitos
  const regex = /^\+\d{10,15}$/
  const isValid = regex.test(cleanNumber)

  let countryCode = ""
  if (isValid) {
    // Extraer código de país
    const countryCodeMatch = cleanNumber.match(/^\+(\d{1,3})/)
    if (countryCodeMatch) {
      countryCode = countryCodeMatch[1]
    }
  }

  return {
    isValid,
    formattedNumber: isValid ? cleanNumber : "",
    countryCode,
  }
}

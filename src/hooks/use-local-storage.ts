"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  // Pasar la función de inicialización a useState para que la lógica se ejecute solo una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      // Obtener del localStorage por clave
      const item = window.localStorage.getItem(key)
      // Analizar el JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si hay un error, devolver initialValue
      console.log(error)
      return initialValue
    }
  })

  // Devolver una versión envuelta de la función setter de useState que persiste el nuevo valor en localStorage
  const setValue = (value: T) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Guardar estado
      setStoredValue(valueToStore)
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.log(error)
    }
  }

  // Efecto para sincronizar con localStorage cuando la clave cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [key])

  return [storedValue, setValue]
}

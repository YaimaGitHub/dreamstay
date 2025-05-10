"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, FileJson } from "lucide-react"
import { useState, useRef } from "react"
import { useDataStore } from "@/hooks/use-data-store"
import { useToast } from "@/hooks/use-toast"

const Footer = () => {
  const { importData } = useDataStore()
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleConfigImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string
        const success = importData(jsonData)

        if (success) {
          toast({
            title: "Configuración cargada",
            description: "La configuración se ha cargado correctamente y se ha aplicado a todo el sitio.",
          })
        } else {
          throw new Error("Formato de archivo inválido")
        }
      } catch (error) {
        toast({
          title: "Error al cargar la configuración",
          description: "El archivo seleccionado no es válido o está corrupto",
          variant: "destructive",
        })
        console.error("Error al cargar la configuración:", error)
      } finally {
        setIsImporting(false)
        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error al leer el archivo",
        description: "No se pudo leer el archivo seleccionado",
        variant: "destructive",
      })
      setIsImporting(false)
      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    reader.readAsText(file)
  }

  return (
    <footer className="bg-deepblue text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Estancia Plus</h3>
            <p className="text-gray-300 mb-4">
              Ofrecemos una experiencia de alojamiento única, combinando confort, elegancia y atención personalizada
              para hacer de tu estancia algo inolvidable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/habitaciones" className="text-gray-300 hover:text-white transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-300 hover:text-white transition-colors">
                  Administración
                </Link>
              </li>
              <li>
                <button
                  onClick={handleConfigImportClick}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <FileJson className="h-4 w-4 mr-1" />
                  Cargar configuración
                </button>
                <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileChange} className="hidden" />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-terracotta" />
                <span className="text-gray-300">Av. Principal 123, Ciudad Ejemplo, País</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-terracotta" />
                <span className="text-gray-300">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-terracotta" />
                <span className="text-gray-300">info@estanciaplus.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Boletín informativo</h3>
            <p className="text-gray-300 mb-4">
              Suscríbete a nuestro boletín para recibir ofertas exclusivas y novedades.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-deepblue-light text-white border-gray-700"
              />
              <Button className="bg-terracotta hover:bg-terracotta/90 text-white">Suscribirse</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Estancia Plus. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

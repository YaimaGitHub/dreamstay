import type React from "react"

import { toast } from "@/components/ui/use-toast"
import { generateRoomsFileContent, generateServicesFileContent } from "./file-system-utils"
import type { Room } from "@/types/room"

export interface Service {
  id: number
  title: string
  description: string
  longDescription?: string
  price: number
  category: string
  icon?: React.ReactNode
  features?: string[]
}

// Function to assign icons based on category
export const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "gastronomía":
      return "Utensils"
    case "transporte":
      return "Car"
    case "comodidades":
      return "Wifi"
    case "experiencias":
      return "MapPin"
    default:
      return "Wifi"
  }
}

// Function to generate and download TypeScript files
export const generateTypeScriptFiles = (rooms: Room[], services: any[], provinces: string[]) => {
  try {
    // Process services to replace React nodes with string names
    const processedServices = services.map((service) => {
      // Create a copy to avoid modifying the original
      const processedService = { ...service }

      // Assign icon based on category
      processedService.icon = getIconForCategory(service.category)

      // Format features as strings with quotes
      if (processedService.features) {
        processedService.features = processedService.features.map((feature: string) => `"${feature}"`)
      }

      return processedService
    })

    // Generate code for rooms.ts
    const roomsSourceCode = generateRoomsFileContent(rooms)

    // Generate code for services.ts
    const servicesSourceCode = generateServicesFileContent(processedServices)

    // Generate code for provinces.ts
    const provincesSourceCode = generateProvincesSourceCode(provinces)

    // Create blobs and download links
    downloadFile(roomsSourceCode, "rooms.ts")

    setTimeout(() => {
      downloadFile(servicesSourceCode, "services.ts")

      setTimeout(() => {
        downloadFile(provincesSourceCode, "provinces.ts")

        toast({
          title: "Archivos TypeScript generados",
          description: "Los archivos se han descargado correctamente",
        })

        console.log("Archivos TypeScript generados y descargados")
      }, 100)
    }, 100)

    return true
  } catch (error) {
    console.error("Error al generar archivos TypeScript:", error)
    toast({
      title: "Error",
      description: "No se pudieron generar los archivos TypeScript.",
      variant: "destructive",
    })
    return false
  }
}

// Helper function to generate provinces.ts source code
const generateProvincesSourceCode = (provinces: string[]) => {
  let code = `// Archivo generado automáticamente por el panel de administración
// Última actualización: ${new Date().toLocaleString()}

// Lista de provincias de Cuba
export const cubanProvinces = [\n`

  provinces.forEach((province, index) => {
    code += `  "${province}"${index < provinces.length - 1 ? "," : ""}\n`
  })

  code += `];\n`
  return code
}

// Helper function to download a file
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"

  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

import type { Room } from "@/types/room"
import type { Service } from "@/types/service"
import { toast } from "@/components/ui/sonner"
import {
  generateRoomsSourceCode,
  generateServicesSourceCode,
  generateProvincesSourceCode,
} from "./source-code-generator"

// Nombre del archivo de configuración único
export const CONFIG_FILE_NAME = "estanciaplus_config.txt"

// Estructura del archivo de configuración
export interface ConfigFile {
  rooms: Room[]
  services: Service[]
  provinces: string[]
  lastUpdated: string
  version: string
}

// Separadores para las secciones del archivo
const SECTION_SEPARATORS = {
  START: "// ==================== INICIO CONFIGURACIÓN ESTANCIAPLUS ====================",
  CONFIG: "// ==================== CONFIGURACIÓN JSON ====================",
  ROOMS: "// ==================== ARCHIVO: rooms.ts ====================",
  SERVICES: "// ==================== ARCHIVO: services.ts ====================",
  PROVINCES: "// ==================== ARCHIVO: provinces.ts ====================",
  INSTRUCTIONS: "// ==================== INSTRUCCIONES ====================",
  END: "// ==================== FIN CONFIGURACIÓN ESTANCIAPLUS ====================",
}

/**
 * Genera el contenido del archivo de configuración único
 */
export const generateConfigFileContent = (
  rooms: Room[],
  services: Service[],
  provinces: string[],
  lastUpdated: Date | null,
): string => {
  // Generar el código fuente para todos los archivos
  const roomsSourceCode = generateRoomsSourceCode(rooms)
  const servicesSourceCode = generateServicesSourceCode(services)
  const provincesSourceCode = generateProvincesSourceCode(provinces)

  // Crear objeto de configuración
  const configObject: ConfigFile = {
    rooms,
    services,
    provinces,
    lastUpdated: lastUpdated ? lastUpdated.toISOString() : new Date().toISOString(),
    version: "1.0.0",
  }

  // Convertir a JSON con formato legible
  const configJson = JSON.stringify(configObject, null, 2)

  // Crear el contenido del archivo único
  return `${SECTION_SEPARATORS.START}

${SECTION_SEPARATORS.CONFIG}
${configJson}

${SECTION_SEPARATORS.ROOMS}
${roomsSourceCode}

${SECTION_SEPARATORS.SERVICES}
${servicesSourceCode}

${SECTION_SEPARATORS.PROVINCES}
${provincesSourceCode}

${SECTION_SEPARATORS.INSTRUCTIONS}
// 1. Este archivo contiene toda la configuración de EstanciaPlus en un único archivo.
// 2. Para actualizar la configuración, simplemente reemplace este archivo completo.
// 3. Para extraer los archivos individuales:
//    - Copie la sección entre "ARCHIVO: rooms.ts" y la siguiente sección en src/data/rooms.ts
//    - Copie la sección entre "ARCHIVO: services.ts" y la siguiente sección en src/data/services.ts
//    - Copie la sección entre "ARCHIVO: provinces.ts" y la siguiente sección en src/data/provinces.ts
// 4. La sección "CONFIGURACIÓN JSON" contiene todos los datos en formato JSON para importación directa.
// 5. Guarde todos los archivos y reinicie la aplicación para que los cambios surtan efecto.

${SECTION_SEPARATORS.END}`
}

/**
 * Extrae la configuración JSON del archivo de configuración
 */
export const extractConfigFromFileContent = (fileContent: string): ConfigFile | null => {
  try {
    // Buscar la sección de configuración JSON
    const configStart = fileContent.indexOf(SECTION_SEPARATORS.CONFIG) + SECTION_SEPARATORS.CONFIG.length
    const configEnd = fileContent.indexOf(SECTION_SEPARATORS.ROOMS)

    if (configStart === -1 || configEnd === -1) {
      console.error("No se pudo encontrar la sección de configuración JSON en el archivo")
      return null
    }

    // Extraer y parsear el JSON
    const configJson = fileContent.substring(configStart, configEnd).trim()
    return JSON.parse(configJson) as ConfigFile
  } catch (error) {
    console.error("Error al extraer la configuración del archivo:", error)
    return null
  }
}

/**
 * Extrae el código fuente de rooms.ts del archivo de configuración
 */
export const extractRoomsSourceCode = (fileContent: string): string | null => {
  try {
    const roomsStart = fileContent.indexOf(SECTION_SEPARATORS.ROOMS) + SECTION_SEPARATORS.ROOMS.length
    const roomsEnd = fileContent.indexOf(SECTION_SEPARATORS.SERVICES)

    if (roomsStart === -1 || roomsEnd === -1) {
      console.error("No se pudo encontrar la sección de rooms.ts en el archivo")
      return null
    }

    return fileContent.substring(roomsStart, roomsEnd).trim()
  } catch (error) {
    console.error("Error al extraer el código de rooms.ts:", error)
    return null
  }
}

/**
 * Extrae el código fuente de services.ts del archivo de configuración
 */
export const extractServicesSourceCode = (fileContent: string): string | null => {
  try {
    const servicesStart = fileContent.indexOf(SECTION_SEPARATORS.SERVICES) + SECTION_SEPARATORS.SERVICES.length
    const servicesEnd = fileContent.indexOf(SECTION_SEPARATORS.PROVINCES)

    if (servicesStart === -1 || servicesEnd === -1) {
      console.error("No se pudo encontrar la sección de services.ts en el archivo")
      return null
    }

    return fileContent.substring(servicesStart, servicesEnd).trim()
  } catch (error) {
    console.error("Error al extraer el código de services.ts:", error)
    return null
  }
}

/**
 * Extrae el código fuente de provinces.ts del archivo de configuración
 */
export const extractProvincesSourceCode = (fileContent: string): string | null => {
  try {
    const provincesStart = fileContent.indexOf(SECTION_SEPARATORS.PROVINCES) + SECTION_SEPARATORS.PROVINCES.length
    const provincesEnd = fileContent.indexOf(SECTION_SEPARATORS.INSTRUCTIONS)

    if (provincesStart === -1 || provincesEnd === -1) {
      console.error("No se pudo encontrar la sección de provinces.ts en el archivo")
      return null
    }

    return fileContent.substring(provincesStart, provincesEnd).trim()
  } catch (error) {
    console.error("Error al extraer el código de provinces.ts:", error)
    return null
  }
}

/**
 * Verifica si el contenido es un archivo de configuración válido
 */
export const isValidConfigFile = (fileContent: string): boolean => {
  return (
    fileContent.includes(SECTION_SEPARATORS.START) &&
    fileContent.includes(SECTION_SEPARATORS.CONFIG) &&
    fileContent.includes(SECTION_SEPARATORS.ROOMS) &&
    fileContent.includes(SECTION_SEPARATORS.SERVICES) &&
    fileContent.includes(SECTION_SEPARATORS.PROVINCES) &&
    fileContent.includes(SECTION_SEPARATORS.END)
  )
}

/**
 * Descarga el archivo de configuración único
 */
export const downloadConfigFile = (
  rooms: Room[],
  services: Service[],
  provinces: string[],
  lastUpdated: Date | null,
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Reforzar la autenticación antes de comenzar
      localStorage.setItem("adminAuth", "true")

      // Generar el contenido del archivo
      const fileContent = generateConfigFileContent(rooms, services, provinces, lastUpdated)

      // Crear un blob con el contenido
      const blob = new Blob([fileContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // Crear un enlace para la descarga
      const a = document.createElement("a")
      a.href = url
      a.download = CONFIG_FILE_NAME
      a.style.display = "none"
      document.body.appendChild(a)

      // Usar setTimeout para evitar problemas de navegación
      setTimeout(() => {
        a.click()

        // Limpiar después de un tiempo
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          // Reforzar la autenticación después de la descarga
          localStorage.setItem("adminAuth", "true")

          toast.success("Archivo de configuración exportado correctamente", {
            description:
              "Se ha descargado el archivo de configuración único. Este archivo contiene toda la configuración del sitio.",
            duration: 8000,
          })

          resolve(true)
        }, 500)
      }, 100)
    } catch (error) {
      console.error("Error al generar y descargar el archivo de configuración:", error)
      toast.error("Error al generar el archivo de configuración")

      // Reforzar la autenticación incluso en caso de error
      localStorage.setItem("adminAuth", "true")

      resolve(false)
    }
  })
}

/**
 * Lee un archivo de configuración y devuelve su contenido
 */
export const readConfigFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error("No se pudo leer el archivo"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"))
    }

    reader.readAsText(file)
  })
}

/**
 * Importa la configuración desde un archivo
 */
export const importConfigFromFile = async (
  file: File,
  setRooms: (rooms: Room[]) => void,
  setServices: (services: Service[]) => void,
  setProvinces: (provinces: string[]) => void,
  setLastUpdated: (date: Date) => void,
): Promise<boolean> => {
  try {
    // Leer el contenido del archivo
    const fileContent = await readConfigFile(file)

    // Verificar si es un archivo de configuración válido
    if (!isValidConfigFile(fileContent)) {
      toast.error("El archivo no es un archivo de configuración válido")
      return false
    }

    // Extraer la configuración
    const config = extractConfigFromFileContent(fileContent)
    if (!config) {
      toast.error("No se pudo extraer la configuración del archivo")
      return false
    }

    // Actualizar el estado
    setRooms(config.rooms)
    setServices(config.services)
    setProvinces(config.provinces)
    setLastUpdated(new Date(config.lastUpdated))

    toast.success("Configuración importada correctamente", {
      description: "La configuración se ha importado correctamente desde el archivo.",
    })

    return true
  } catch (error) {
    console.error("Error al importar la configuración:", error)
    toast.error("Error al importar la configuración")
    return false
  }
}

/**
 * Importa la configuración desde texto
 */
export const importConfigFromText = (
  text: string,
  setRooms: (rooms: Room[]) => void,
  setServices: (services: Service[]) => void,
  setProvinces: (provinces: string[]) => void,
  setLastUpdated: (date: Date) => void,
): boolean => {
  try {
    // Verificar si es un archivo de configuración válido
    if (isValidConfigFile(text)) {
      // Es un archivo de configuración completo
      const config = extractConfigFromFileContent(text)
      if (!config) {
        toast.error("No se pudo extraer la configuración del texto")
        return false
      }

      // Actualizar el estado
      setRooms(config.rooms)
      setServices(config.services)
      setProvinces(config.provinces)
      setLastUpdated(new Date(config.lastUpdated))
    } else {
      // Intentar parsear como JSON simple
      try {
        const jsonData = JSON.parse(text)

        if (jsonData.rooms && Array.isArray(jsonData.rooms)) {
          setRooms(jsonData.rooms)
        }

        if (jsonData.services && Array.isArray(jsonData.services)) {
          setServices(jsonData.services)
        }

        if (jsonData.provinces && Array.isArray(jsonData.provinces)) {
          setProvinces(jsonData.provinces)
        }

        if (jsonData.lastUpdated) {
          setLastUpdated(new Date(jsonData.lastUpdated))
        } else {
          setLastUpdated(new Date())
        }
      } catch (jsonError) {
        toast.error("El texto no es un archivo de configuración válido ni un JSON válido")
        return false
      }
    }

    toast.success("Configuración importada correctamente", {
      description: "La configuración se ha importado correctamente desde el texto.",
    })

    return true
  } catch (error) {
    console.error("Error al importar la configuración desde texto:", error)
    toast.error("Error al importar la configuración")
    return false
  }
}

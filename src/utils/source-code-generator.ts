import type { Room } from "@/types/room"
import type { Service } from "@/types/service"

/**
 * Genera el código fuente para el archivo rooms.ts con TODOS los datos
 */
export const generateRoomsSourceCode = (rooms: Room[]): string => {
  console.log("🔧 Generando código para rooms.ts con", rooms.length, "habitaciones")

  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    console.warn("⚠️ No hay habitaciones para generar")
    return `import type { Room } from "@/types/room"

export const roomsData: Room[] = []

export default roomsData`
  }

  const roomsCode = rooms
    .map((room, index) => {
      console.log(`  🔧 Procesando habitación ${index + 1}: ${room.title}`)
      console.log(`    📱 WhatsApp: ${room.whatsappNumber || "No configurado"}`)
      console.log(`    📅 Fechas reservadas: ${room.reservedDates?.length || 0}`)

      // Asegurar que todos los campos estén presentes y sean válidos
      const safeRoom = {
        id: room.id || index + 1,
        title: (room.title || "Habitación sin título").replace(/"/g, '\\"'),
        description: (room.description || "Habitación cómoda y bien equipada").replace(/"/g, '\\"'),
        location: (room.location || "Ubicación central").replace(/"/g, '\\"'),
        province: (room.province || "La Habana").replace(/"/g, '\\"'),
        price: room.price || 0,
        rating: room.rating || 4.5,
        reviews: room.reviews || 0,
        image: room.image || "/placeholder.svg?height=400&width=600",
        features: room.features || ["WiFi gratis", "Aire acondicionado"],
        type: room.type || "Estándar",
        area: room.area || 25,
        available: room.available !== undefined ? room.available : true,
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
        images: room.images || [],
        reservedDates: room.reservedDates || [],
        lastUpdated: room.lastUpdated || new Date().toISOString(),
        whatsappNumber: room.whatsappNumber || "", // CAMPO CRÍTICO
      }

      // Generar código para imágenes
      const imagesCode =
        safeRoom.images.length > 0
          ? safeRoom.images
              .map((img) => {
                if (typeof img === "string") {
                  return `"${img}"`
                } else if (img && typeof img === "object" && img.url) {
                  return `{
      id: ${img.id || 1},
      url: "${img.url}",
      alt: "${(img.alt || "").replace(/"/g, '\\"')}"
    }`
                }
                return `"${safeRoom.image}"`
              })
              .join(",\n      ")
          : ""

      // Generar código para fechas reservadas - CAMPO CRÍTICO
      const reservedDatesCode =
        safeRoom.reservedDates.length > 0
          ? safeRoom.reservedDates
              .map((date) => {
                if (typeof date === "string") {
                  return `"${date}"`
                } else if (date && typeof date === "object" && date.start && date.end) {
                  return `{
      start: "${date.start}",
      end: "${date.end}"
    }`
                }
                return `"${date}"`
              })
              .join(",\n      ")
          : ""

      return `  {
    id: ${safeRoom.id},
    title: "${safeRoom.title}",
    description: "${safeRoom.description}",
    location: "${safeRoom.location}",
    province: "${safeRoom.province}",
    price: ${safeRoom.price},
    rating: ${safeRoom.rating},
    reviews: ${safeRoom.reviews},
    image: "${safeRoom.image}",
    features: [${safeRoom.features.map((feature) => `"${feature.replace(/"/g, '\\"')}"`).join(", ")}],
    type: "${safeRoom.type}",
    area: ${safeRoom.area},
    available: ${safeRoom.available},
    isAvailable: ${safeRoom.isAvailable},
    images: [${imagesCode}],
    reservedDates: [${reservedDatesCode}],
    lastUpdated: "${safeRoom.lastUpdated}",
    whatsappNumber: "${safeRoom.whatsappNumber}", // CAMPO CRÍTICO: WhatsApp del anfitrión
  }`
    })
    .join(",\n")

  const generatedCode = `import type { Room } from "@/types/room"

export const roomsData: Room[] = [
${roomsCode}
]

export default roomsData`

  console.log(`✅ Código generado para rooms.ts: ${generatedCode.length} caracteres`)
  return generatedCode
}

/**
 * Genera el código fuente para el archivo services.ts con TODOS los datos
 */
export const generateServicesSourceCode = (services: Service[]): string => {
  console.log("🔧 Generando código para services.ts con", services.length, "servicios")

  if (!services || !Array.isArray(services) || services.length === 0) {
    console.warn("⚠️ No hay servicios para generar")
    return `import type { Service } from "@/types/service"

export const allServices: Service[] = []

export default allServices`
  }

  const servicesCode = services
    .map((service, index) => {
      console.log(`  🔧 Procesando servicio ${index + 1}: ${service.name}`)

      // Asegurar que todos los campos estén presentes
      const safeService = {
        id: service.id || index + 1,
        name: (service.name || "Servicio sin nombre").replace(/"/g, '\\"'),
        description: (service.description || "Descripción del servicio").replace(/"/g, '\\"'),
        price: service.price || 0,
        category: service.category || "general",
        duration: service.duration || "1 hora",
        available: service.available !== undefined ? service.available : true,
        featured: service.featured || false,
        image: service.image || "/placeholder.svg?height=300&width=400",
        features: service.features || [],
        lastUpdated: service.lastUpdated || new Date().toISOString(),
      }

      return `  {
    id: ${safeService.id},
    name: "${safeService.name}",
    description: "${safeService.description}",
    price: ${safeService.price},
    category: "${safeService.category}",
    duration: "${safeService.duration}",
    available: ${safeService.available},
    featured: ${safeService.featured},
    image: "${safeService.image}",
    features: [${safeService.features.map((feature) => `"${feature.replace(/"/g, '\\"')}"`).join(", ")}],
    lastUpdated: "${safeService.lastUpdated}",
  }`
    })
    .join(",\n")

  const generatedCode = `import type { Service } from "@/types/service"

export const allServices: Service[] = [
${servicesCode}
]

export default allServices`

  console.log(`✅ Código generado para services.ts: ${generatedCode.length} caracteres`)
  return generatedCode
}

/**
 * Genera el código fuente para el archivo provinces.ts
 */
export const generateProvincesSourceCode = (provinces: string[]): string => {
  console.log("🔧 Generando código para provinces.ts con", provinces.length, "provincias")

  const provincesCode = provinces.map((province) => `  "${province.replace(/"/g, '\\"')}"`).join(",\n")

  const generatedCode = `export const cubanProvinces: string[] = [
${provincesCode}
]

export default cubanProvinces`

  console.log(`✅ Código generado para provinces.ts: ${generatedCode.length} caracteres`)
  return generatedCode
}

/**
 * Genera el código fuente completo para todos los archivos
 */
export const generateAllSourceCode = (
  rooms: Room[],
  services: Service[],
  provinces: string[],
): { rooms: string; services: string; provinces: string } => {
  return {
    rooms: generateRoomsSourceCode(rooms),
    services: generateServicesSourceCode(services),
    provinces: generateProvincesSourceCode(provinces),
  }
}

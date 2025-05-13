
import { Room } from "@/types/room"
import { Service } from "@/types/service"
import { toast } from "@/components/ui/sonner"

// Helper function to assign icons based on service category
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

// Function to generate the code source of rooms.ts with the exact required format
export const generateRoomsSourceCode = (roomsData: Room[]) => {
  // Convert rooms to a format that preserves the original structure
  const formattedRooms = roomsData.map((room) => {
    // Create a copy to avoid modifying the original
    const formattedRoom = { ...room }

    // Format features as strings with quotes
    if (formattedRoom.features) {
      formattedRoom.features = formattedRoom.features.map((feature) => `"${feature}"`)
    }

    return formattedRoom
  })

  // Generate the code with the proper format
  let code = `// Archivo generado automáticamente por el panel de administración
// Última actualización: ${new Date().toLocaleString()}

export const roomsData = [\n`

  formattedRooms.forEach((room, index) => {
    code += `  {\n`
    code += `    id: ${room.id},\n`
    code += `    title: "${room.title}",\n`
    code += `    location: "${room.location}",\n`

    // Include province if it exists
    if (room.province) {
      code += `    province: "${room.province}",\n`
    }

    code += `    price: ${room.price},\n`
    code += `    rating: ${room.rating},\n`
    code += `    reviews: ${room.reviews},\n`
    code += `    image: "${room.image}",\n`
    code += `    features: [${room.features?.join(", ") || ""}],\n`
    code += `    type: "${room.type}",\n`
    code += `    area: ${room.area},\n`

    if (room.description !== undefined) {
      code += `    description: "${room.description.replace(/"/g, '\\"')}",\n`
    }

    // Always include the available property
    code += `    available: ${room.available === undefined ? true : room.available},\n`

    // Include lastUpdated if it exists
    if (room.lastUpdated) {
      code += `    lastUpdated: "${room.lastUpdated}",\n`
    }

    if (room.images && room.images.length > 0) {
      code += `    images: [\n`
      room.images.forEach((image, imgIndex) => {
        code += `      {\n`
        code += `        id: ${image.id},\n`
        code += `        url: "${image.url}",\n`
        code += `        alt: "${image.alt.replace(/"/g, '\\"')}"\n`
        code += `      }${imgIndex < room.images!.length - 1 ? "," : ""}\n`
      })
      code += `    ],\n`
    }

    if (room.amenities && room.amenities.length > 0) {
      code += `    amenities: [\n`
      room.amenities.forEach((amenity, amenityIndex) => {
        code += `      {\n`
        code += `        id: ${amenity.id},\n`
        code += `        name: "${amenity.name}",\n`
        code += `        description: "${amenity.description.replace(/"/g, '\\"')}"\n`
        code += `      }${amenityIndex < room.amenities!.length - 1 ? "," : ""}\n`
      })
      code += `    ],\n`
    }

    // Include reservedDates if they exist
    if (room.reservedDates && room.reservedDates.length > 0) {
      code += `    reservedDates: [\n`
      room.reservedDates.forEach((date, dateIndex) => {
        code += `      {\n`
        code += `        start: "${date.start}",\n`
        code += `        end: "${date.end}"\n`
        code += `      }${dateIndex < room.reservedDates!.length - 1 ? "," : ""}\n`
      })
      code += `    ],\n`
    }

    code += `  }${index < formattedRooms.length - 1 ? "," : ""}\n`
  })

  code += `];\n`
  return code
}

// Function to generate the code source of services.ts with the exact required format
export const generateServicesSourceCode = (servicesData: Service[]) => {
  // Convert services to a format that preserves the original structure
  const formattedServices = servicesData.map((service) => {
    // Create a copy to avoid modifying the original
    const formattedService = { ...service }

    // Format features as strings with quotes
    if (formattedService.features) {
      formattedService.features = formattedService.features.map((feature) => `"${feature}"`)
    }

    return formattedService
  })

  // Generate the code with the proper format
  let code = `// Archivo generado automáticamente por el panel de administración
// Última actualización: ${new Date().toLocaleString()}

import { Utensils, Car, Wifi, MapPin } from 'lucide-react';

export const allServices = [\n`

  formattedServices.forEach((service, index) => {
    code += `  {\n`
    code += `    id: ${service.id},\n`
    code += `    title: "${service.title}",\n`
    code += `    description: "${service.description.replace(/"/g, '\\"')}",\n`

    if (service.longDescription !== undefined) {
      code += `    longDescription: "${service.longDescription.replace(/"/g, '\\"')}",\n`
    }

    code += `    price: ${service.price},\n`
    code += `    category: "${service.category}",\n`

    // Assign an icon based on the category
    code += `    icon: ${getIconForCategory(service.category)},\n`

    if (service.features && service.features.length > 0) {
      code += `    features: [${service.features.join(", ")}],\n`
    }

    code += `  }${index < formattedServices.length - 1 ? "," : ""}\n`
  })

  code += `];\n`
  return code
}

// Function to generate the code source of provinces.ts
export const generateProvincesSourceCode = (provinces: string[]) => {
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

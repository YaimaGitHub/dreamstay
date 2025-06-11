import type { Room } from "@/types/room"
import type { Service } from "@/types/service"

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
  console.log("=== Generating rooms source code ===")
  console.log("Number of rooms:", roomsData.length)

  // Convert rooms to a format that preserves the original structure
  const formattedRooms = roomsData.map((room) => {
    // Create a copy to avoid modifying the original
    const formattedRoom = { ...room }

    // Log all data for debugging
    if (formattedRoom.pricing) {
      console.log(`Room ${formattedRoom.id} - Pricing data for export:`, formattedRoom.pricing)
    }
    if (formattedRoom.hostWhatsApp) {
      console.log(`Room ${formattedRoom.id} - WhatsApp data for export:`, formattedRoom.hostWhatsApp)
    }
    if (formattedRoom.hosts) {
      console.log(`Room ${formattedRoom.id} - Hosts data for export:`, formattedRoom.hosts)
    }
    if (formattedRoom.capacity) {
      console.log(`Room ${formattedRoom.id} - Capacity data for export:`, formattedRoom.capacity)
    }

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

    // Include accommodation type
    if (room.accommodationType) {
      code += `    accommodationType: "${room.accommodationType}",\n`
    }

    // CRITICAL: Include capacity information - ALWAYS EXPORT THIS
    if (room.capacity) {
      console.log(`Exporting capacity for room ${room.id}:`, room.capacity)
      code += `    capacity: {\n`
      code += `      maxGuests: ${room.capacity.maxGuests || 4},\n`
      code += `      beds: ${room.capacity.beds || 1},\n`
      code += `      bedrooms: ${room.capacity.bedrooms || 1},\n`
      code += `      bathrooms: ${room.capacity.bathrooms || 1}\n`
      code += `    },\n`
    } else {
      // If capacity is missing, add default values
      code += `    capacity: {\n`
      code += `      maxGuests: 4,\n`
      code += `      beds: 1,\n`
      code += `      bedrooms: 1,\n`
      code += `      bathrooms: 1\n`
      code += `    },\n`
    }

    // CRITICAL: Include hosts information (multiple hosts) - ALWAYS EXPORT THIS
    if (room.hosts && room.hosts.length > 0) {
      console.log(`Exporting hosts for room ${room.id}:`, room.hosts)
      code += `    hosts: [\n`
      room.hosts.forEach((host, hostIndex) => {
        code += `      {\n`
        code += `        id: ${host.id},\n`
        code += `        name: "${(host.name || "").replace(/"/g, '\\"')}",\n`
        code += `        hostSince: "${host.hostSince || ""}",\n`
        code += `        isPrimary: ${host.isPrimary || false},\n`

        if (host.bio) {
          code += `        bio: "${host.bio.replace(/"/g, '\\"')}",\n`
        } else {
          code += `        bio: "",\n`
        }

        if (host.avatar) {
          code += `        avatar: "${host.avatar}"\n`
        } else {
          code += `        avatar: ""\n`
        }

        code += `      }${hostIndex < room.hosts!.length - 1 ? "," : ""}\n`
      })
      code += `    ],\n`
    } else {
      // If hosts are missing, add a default host
      code += `    hosts: [\n`
      code += `      {\n`
      code += `        id: ${Date.now()},\n`
      code += `        name: "Anfitrión",\n`
      code += `        hostSince: "${new Date().getFullYear()}",\n`
      code += `        isPrimary: true,\n`
      code += `        bio: "",\n`
      code += `        avatar: ""\n`
      code += `      }\n`
      code += `    ],\n`
    }

    // Include lastUpdated if it exists
    if (room.lastUpdated) {
      code += `    lastUpdated: "${room.lastUpdated}",\n`
    }

    // CRÍTICO: Include WhatsApp configuration
    if (room.hostWhatsApp) {
      console.log(`Exporting WhatsApp for room ${room.id}:`, room.hostWhatsApp)
      code += `    hostWhatsApp: {\n`
      code += `      enabled: ${room.hostWhatsApp.enabled},\n`
      code += `      primary: "${room.hostWhatsApp.primary}",\n`
      code += `      secondary: "${room.hostWhatsApp.secondary || ""}",\n`
      code += `      sendToPrimary: ${room.hostWhatsApp.sendToPrimary},\n`
      code += `      sendToSecondary: ${room.hostWhatsApp.sendToSecondary}\n`
      code += `    },\n`
    }

    // Include pricing configuration - CRITICAL SECTION
    if (room.pricing && (room.pricing.nationalTourism || room.pricing.internationalTourism)) {
      console.log(`Exporting pricing for room ${room.id}:`, room.pricing)
      code += `    pricing: {\n`

      // National Tourism Pricing
      if (room.pricing.nationalTourism) {
        code += `      nationalTourism: {\n`
        code += `        enabled: ${room.pricing.nationalTourism.enabled},\n`

        if (room.pricing.nationalTourism.nightlyRate) {
          code += `        nightlyRate: {\n`
          code += `          enabled: ${room.pricing.nationalTourism.nightlyRate.enabled},\n`
          code += `          price: ${room.pricing.nationalTourism.nightlyRate.price}\n`
          code += `        },\n`
        }

        if (room.pricing.nationalTourism.hourlyRate) {
          code += `        hourlyRate: {\n`
          code += `          enabled: ${room.pricing.nationalTourism.hourlyRate.enabled},\n`
          code += `          price: ${room.pricing.nationalTourism.hourlyRate.price}\n`
          code += `        }\n`
        }

        code += `      }`

        // Add comma if international tourism follows
        if (room.pricing.internationalTourism) {
          code += `,\n`
        } else {
          code += `\n`
        }
      }

      // International Tourism Pricing
      if (room.pricing.internationalTourism) {
        code += `      internationalTourism: {\n`
        code += `        enabled: ${room.pricing.internationalTourism.enabled},\n`

        if (room.pricing.internationalTourism.nightlyRate) {
          code += `        nightlyRate: {\n`
          code += `          enabled: ${room.pricing.internationalTourism.nightlyRate.enabled},\n`
          code += `          price: ${room.pricing.internationalTourism.nightlyRate.price}\n`
          code += `        }\n`
        }

        code += `      }\n`
      }

      code += `    },\n`
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

    // CRÍTICO: Include reservedDates if they exist
    if (room.reservedDates && room.reservedDates.length > 0) {
      console.log(`Exporting reserved dates for room ${room.id}:`, room.reservedDates)
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

  console.log("Generated rooms.ts code preview:")
  console.log(code.substring(0, 1500) + "...")
  console.log("=== End generating rooms source code ===")

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

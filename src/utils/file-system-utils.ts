// Define FileSystem API types
export interface FileSystemFileHandle {
  getFile: () => Promise<File>
  createWritable: () => Promise<FileSystemWritableFileStream>
}

export interface FileSystemWritableFileStream {
  write: (content: any) => Promise<void>
  close: () => Promise<void>
}

// Declare the File System Access API types
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<any>
    showOpenFilePicker?: (options: any) => Promise<FileSystemFileHandle[]>
    showSaveFilePicker?: (options: any) => Promise<FileSystemFileHandle>
  }
}

export const FILE_NAME = "salva.json"

// Helper function to generate rooms.ts file content
export const generateRoomsFileContent = (roomsData: any[]) => {
  let content = `export const roomsData = [\n`

  roomsData.forEach((room, index) => {
    content += `  {\n`
    content += `    id: ${room.id},\n`
    content += `    title: "${room.title}",\n`
    content += `    location: "${room.location}",\n`

    // Include province if it exists
    if (room.province) {
      content += `    province: "${room.province}",\n`
    }

    content += `    price: ${room.price},\n`
    content += `    rating: ${room.rating},\n`
    content += `    reviews: ${room.reviews},\n`
    content += `    image: "${room.image}",\n`
    content += `    features: ${JSON.stringify(room.features)},\n`
    content += `    type: "${room.type}",\n`
    content += `    area: ${room.area},\n`

    if (room.description) {
      content += `    description: "${room.description.replace(/"/g, '\\"')}",\n`
    }

    // Include availability status
    content += `    available: ${room.available !== undefined ? room.available : true},\n`

    // Include lastUpdated if it exists
    if (room.lastUpdated) {
      content += `    lastUpdated: "${room.lastUpdated}",\n`
    }

    if (room.images && room.images.length > 0) {
      content += `    images: ${JSON.stringify(room.images, null, 4).replace(/^/gm, "    ").trim()},\n`
    }

    if (room.amenities && room.amenities.length > 0) {
      content += `    amenities: ${JSON.stringify(room.amenities, null, 4).replace(/^/gm, "    ").trim()},\n`
    }

    // Include reservedDates if they exist
    if (room.reservedDates && room.reservedDates.length > 0) {
      content += `    reservedDates: ${JSON.stringify(room.reservedDates, null, 4).replace(/^/gm, "    ").trim()},\n`
    }

    content += `  }${index < roomsData.length - 1 ? "," : ""}\n`
  })

  content += `]\n`
  return content
}

// Helper function to generate services.ts file content
export const generateServicesFileContent = (servicesData: any[]) => {
  let content = `import { Utensils, Car, Wifi, MapPin } from 'lucide-react';\n\n`
  content += `export const allServices = ${JSON.stringify(servicesData, null, 2)
    .replace(/"icon": "([^"]+)"/g, (match, iconName) => `"icon": ${iconName}`)
    .replace(/"/g, '"')}\n`
  return content
}

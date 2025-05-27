import type { Room } from "@/types/room"
import type { Service } from "@/types/service"
import { toast } from "@/components/ui/sonner"
import {
  generateRoomsSourceCode,
  generateServicesSourceCode,
  generateProvincesSourceCode,
} from "./source-code-generator"

// Function to generate and download TypeScript files
export const generateTypeScriptFiles = (rooms: Room[], services: Service[], provinces: string[]): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log("Generando archivos TypeScript con datos actualizados...")

      // Generate source code for rooms.ts
      const roomsSourceCode = generateRoomsSourceCode(rooms)

      // Generate source code for services.ts
      const servicesSourceCode = generateServicesSourceCode(services)

      // Generate source code for provinces.ts
      const provincesSourceCode = generateProvincesSourceCode(provinces)

      // Create blobs for the files
      const roomsBlob = new Blob([roomsSourceCode], { type: "text/typescript" })
      const roomsUrl = URL.createObjectURL(roomsBlob)

      const servicesBlob = new Blob([servicesSourceCode], { type: "text/typescript" })
      const servicesUrl = URL.createObjectURL(servicesBlob)

      const provincesBlob = new Blob([provincesSourceCode], { type: "text/typescript" })
      const provincesUrl = URL.createObjectURL(provincesBlob)

      // Create links to download the files
      const roomsLink = document.createElement("a")
      roomsLink.href = roomsUrl
      roomsLink.download = "rooms.ts"
      roomsLink.style.display = "none"

      const servicesLink = document.createElement("a")
      servicesLink.href = servicesUrl
      servicesLink.download = "services.ts"
      servicesLink.style.display = "none"

      const provincesLink = document.createElement("a")
      provincesLink.href = provincesUrl
      provincesLink.download = "provinces.ts"
      provincesLink.style.display = "none"

      // Add links to the DOM and click them
      document.body.appendChild(roomsLink)
      document.body.appendChild(servicesLink)
      document.body.appendChild(provincesLink)

      // Download files with delays to ensure proper download
      roomsLink.click()

      setTimeout(() => {
        servicesLink.click()

        setTimeout(() => {
          provincesLink.click()

          // Cleanup
          setTimeout(() => {
            document.body.removeChild(roomsLink)
            document.body.removeChild(servicesLink)
            document.body.removeChild(provincesLink)
            URL.revokeObjectURL(roomsUrl)
            URL.revokeObjectURL(servicesUrl)
            URL.revokeObjectURL(provincesUrl)

            console.log("Archivos TypeScript generados y descargados correctamente")

            toast.success("Archivos TypeScript generados", {
              description:
                "Los archivos rooms.ts, services.ts y provinces.ts han sido descargados. Reemplaza los archivos originales en tu proyecto.",
              duration: 8000,
            })

            // Show additional instructions
            setTimeout(() => {
              toast.info("Importante: Para aplicar los cambios", {
                description:
                  "1. Reemplaza los archivos en src/data/ con los descargados\n2. Reinicia la aplicación\n3. Los cambios se reflejarán en toda la plataforma",
                duration: 10000,
              })
            }, 1000)

            resolve(true)
          }, 1000)
        }, 800)
      }, 800)
    } catch (error) {
      console.error("Error al generar archivos TypeScript:", error)
      toast.error("Error al generar los archivos TypeScript")
      resolve(false)
    }
  })
}

// Function to export and update source files automatically
export const autoExportSourceFiles = (
  rooms: Room[],
  services: Service[],
  provinces: string[],
  generateTypeScriptFiles: () => Promise<boolean>,
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      console.log("Preparando actualización automática de archivos TypeScript...")

      // Log the current state
      console.log(`Habitaciones a guardar: ${rooms.length}`)
      console.log(`Servicios a guardar: ${services.length}`)
      console.log(`Provincias a guardar: ${provinces.length}`)

      // Verify WhatsApp numbers are preserved
      const roomsWithWhatsApp = rooms.filter((room) => room.whatsappNumber && room.whatsappNumber.trim() !== "")
      console.log(`Habitaciones con WhatsApp configurado: ${roomsWithWhatsApp.length}`)

      // Notify the user that they need to download the files
      toast.info("Cambios guardados temporalmente", {
        description: "Para hacer los cambios permanentes, descarga los archivos TypeScript actualizados.",
        action: {
          label: "Descargar Archivos",
          onClick: async () => {
            const result = await generateTypeScriptFiles()
            resolve(result)
          },
        },
        duration: 8000,
      })

      console.log(
        "Archivos TypeScript listos para descarga. Los cambios incluyen todas las configuraciones de WhatsApp.",
      )

      // Auto-resolve after timeout if user doesn't click
      setTimeout(() => {
        console.log("Auto-resolviendo después del timeout")
        resolve(true)
      }, 8500)
    } catch (error) {
      console.error("Error al preparar la actualización de archivos:", error)
      toast.error("Error al preparar la actualización de archivos")
      resolve(false)
    }
  })
}

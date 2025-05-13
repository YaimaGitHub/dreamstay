
import { Room } from "@/types/room"
import { Service } from "@/types/service"
import { toast } from "@/components/ui/sonner"
import { 
  generateRoomsSourceCode, 
  generateServicesSourceCode, 
  generateProvincesSourceCode 
} from "./source-code-generator"

// Function to generate and download TypeScript files
export const generateTypeScriptFiles = (
  rooms: Room[], 
  services: Service[], 
  provinces: string[]
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Generate source code for rooms.ts
      const roomsSourceCode = generateRoomsSourceCode(rooms)

      // Generate source code for services.ts
      const servicesSourceCode = generateServicesSourceCode(services)

      // Generate source code for provinces.ts
      const provincesSourceCode = generateProvincesSourceCode(provinces)

      // Create blobs for the files
      const roomsBlob = new Blob([roomsSourceCode], { type: "text/plain" })
      const roomsUrl = URL.createObjectURL(roomsBlob)

      const servicesBlob = new Blob([servicesSourceCode], { type: "text/plain" })
      const servicesUrl = URL.createObjectURL(servicesBlob)

      const provincesBlob = new Blob([provincesSourceCode], { type: "text/plain" })
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

      roomsLink.click()

      setTimeout(() => {
        servicesLink.click()

        setTimeout(() => {
          provincesLink.click()

          // Cleanup
          document.body.removeChild(roomsLink)
          document.body.removeChild(servicesLink)
          document.body.removeChild(provincesLink)
          URL.revokeObjectURL(roomsUrl)
          URL.revokeObjectURL(servicesUrl)
          URL.revokeObjectURL(provincesUrl)
          
          toast.success("Archivos TypeScript generados y descargados correctamente")
          console.log("Archivos TypeScript generados y descargados")
          
          resolve(true)
        }, 500) // Increased timeout
      }, 500) // Increased timeout
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
  generateTypeScriptFiles: () => Promise<boolean>
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Notify the user that they need to download the files
      toast.info("Los cambios se han guardado temporalmente", {
        description:
          "Para hacer los cambios permanentes, descarga los archivos TypeScript y reemplázalos en tu proyecto.",
        action: {
          label: "Descargar",
          onClick: async () => {
            const result = await generateTypeScriptFiles();
            resolve(result);
          },
        },
        duration: 5000,
      });

      console.log(
        "Cambios guardados temporalmente. Se requiere descargar los archivos TypeScript para hacerlos permanentes."
      );
      
      // We'll resolve this in the action onClick callback
      // If the user doesn't click, we should resolve after some time
      setTimeout(() => resolve(true), 5500);
    } catch (error) {
      console.error("Error al preparar la actualización de archivos:", error);
      toast.error("Error al preparar la actualización de archivos");
      resolve(false);
    }
  });
};

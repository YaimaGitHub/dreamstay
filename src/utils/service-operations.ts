import type { Service } from "@/types/service"
import { generateServicesSourceCode } from "./source-code-generator"

// Functions for managing services
export const addService = (
  service: Omit<Service, "id">,
  services: Service[],
  setServices: (services: Service[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFiles: () => boolean,
) => {
  const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1
  const newServices = [...services, { ...service, id: newId }]
  setServices(newServices)
  updateLastModified()

  // Update source code directly
  const servicesSourceCode = generateServicesSourceCode(newServices)
  console.log(`Código fuente actualizado con nuevo servicio: ${newId}`)
  console.log(servicesSourceCode.substring(0, 200) + "...")

  autoExportSourceFiles()
}

export const updateService = (
  id: number,
  serviceUpdate: Partial<Service>,
  services: Service[],
  setServices: (services: Service[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFiles: () => boolean,
) => {
  const newServices = services.map((service) => (service.id === id ? { ...service, ...serviceUpdate } : service))
  setServices(newServices)
  updateLastModified()

  // Update source code directly
  const servicesSourceCode = generateServicesSourceCode(newServices)
  console.log(`Código fuente actualizado para servicio ${id}`)
  console.log(servicesSourceCode.substring(0, 200) + "...")

  autoExportSourceFiles()
}

export const deleteService = (
  id: number,
  services: Service[],
  setServices: (services: Service[]) => void,
  updateLastModified: () => Date,
  autoExportSourceFiles: () => boolean,
) => {
  const newServices = services.filter((service) => service.id !== id)
  setServices(newServices)
  updateLastModified()

  // Update source code directly
  const servicesSourceCode = generateServicesSourceCode(newServices)
  console.log(`Código fuente actualizado después de eliminar servicio ${id}`)
  console.log(servicesSourceCode.substring(0, 200) + "...")

  autoExportSourceFiles()
}

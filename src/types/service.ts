
import type React from "react"

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

export interface ServiceStore {
  services: Service[]
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: number, service: Partial<Service>) => void
  deleteService: (id: number) => void
}

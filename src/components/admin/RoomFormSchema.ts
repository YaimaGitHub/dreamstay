import { z } from "zod"

export const roomFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  location: z.string().min(1, "La ubicación es requerida"),
  province: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  image: z.string().optional(),
  type: z.string().min(1, "El tipo es requerido"),
  area: z.number().min(1, "El área debe ser mayor a 0"),
  description: z.string().optional(),
  isAvailable: z.boolean(),
  features: z.array(z.string()),
  lastModified: z.date(),
  // CAMPO CRÍTICO: WhatsApp del anfitrión
  whatsappNumber: z.string().optional(),
})

export type RoomFormValues = z.infer<typeof roomFormSchema>

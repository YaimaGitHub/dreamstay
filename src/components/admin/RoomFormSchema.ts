import * as z from "zod"

export const roomFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  province: z.string().min(1, "La provincia es obligatoria"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  rating: z.number().min(1, "La calificación debe ser entre 1 y 5").max(5, "La calificación debe ser entre 1 y 5"),
  reviews: z.number().min(0, "El número de reseñas debe ser mayor o igual a 0"),
  image: z.string().optional(),
  type: z.string().min(1, "El tipo de habitación es obligatorio"),
  area: z.number().min(1, "El área debe ser mayor a 0"),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  features: z.array(z.string()).optional(),
  lastModified: z.date().optional(),
})

export type RoomFormValues = z.infer<typeof roomFormSchema>

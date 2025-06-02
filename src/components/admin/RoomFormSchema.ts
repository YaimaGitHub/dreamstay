import * as z from "zod"

export const roomFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres",
  }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres",
  }),
  province: z.string().optional(),
  price: z.number().min(0, {
    message: "El precio no puede ser negativo",
  }),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  image: z.string().optional(),
  type: z.string(),
  area: z.number().min(0),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  features: z.array(z.string()),
  lastModified: z.date(),
  pricing: z.object({
    nationalTourism: z.object({
      enabled: z.boolean().default(false),
      nightlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.number().min(0),
      }),
      hourlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.number().min(0),
      }),
    }),
    internationalTourism: z.object({
      enabled: z.boolean().default(false),
      nightlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.number().min(0),
      }),
    }),
  }),
  hostWhatsApp: z.object({
    enabled: z.boolean().default(false),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    sendToPrimary: z.boolean().default(true),
    sendToSecondary: z.boolean().default(false),
  }),
})

export type RoomFormValues = z.infer<typeof roomFormSchema>

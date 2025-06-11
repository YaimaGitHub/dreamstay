import * as z from "zod"

export const roomFormSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  province: z.string().optional(),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  rating: z.coerce.number().min(0, "La calificación debe ser mayor o igual a 0").max(5, "La calificación máxima es 5"),
  reviews: z.coerce.number().min(0, "El número de reseñas debe ser mayor o igual a 0"),
  image: z.string().optional(),
  type: z.string().optional(),
  area: z.coerce.number().min(0, "El área debe ser mayor o igual a 0"),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
  accommodationType: z.string().default("Habitación en alojamiento entero"),
  capacity: z.object({
    maxGuests: z.coerce.number().min(1).default(4),
    beds: z.coerce.number().min(1).default(1),
    bedrooms: z.coerce.number().min(1).default(1),
    bathrooms: z.coerce.number().min(1).default(1),
  }),
  hostWhatsApp: z.object({
    enabled: z.boolean().default(false),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    sendToPrimary: z.boolean().default(true),
    sendToSecondary: z.boolean().default(false),
  }),
  pricing: z.object({
    nationalTourism: z.object({
      enabled: z.boolean().default(false),
      nightlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.coerce.number().min(0),
      }),
      hourlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.coerce.number().min(0),
      }),
    }),
    internationalTourism: z.object({
      enabled: z.boolean().default(false),
      nightlyRate: z.object({
        enabled: z.boolean().default(false),
        price: z.coerce.number().min(0),
      }),
    }),
  }),
})

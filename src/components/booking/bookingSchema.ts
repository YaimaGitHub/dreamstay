import * as z from "zod"

export const bookingSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(100, { message: "El nombre no puede exceder 100 caracteres" })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),

    age: z.coerce
      .number()
      .min(18, { message: "Debes ser mayor de 18 años" })
      .max(120, { message: "Por favor ingresa una edad válida" }),

    gender: z.enum(["male", "female", "other"], {
      required_error: "Por favor selecciona una opción",
    }),

    email: z
      .string()
      .email({ message: "Email inválido" })
      .max(100, { message: "El email no puede exceder 100 caracteres" }),

    phone: z
      .string()
      .min(7, { message: "Número de teléfono inválido" })
      .max(20, { message: "El número de teléfono no puede exceder 20 caracteres" })
      .regex(/^[+]?[\d\s()-]+$/, { message: "Formato de teléfono inválido" }),

    arrivalDate: z.date({
      required_error: "La fecha de llegada es obligatoria",
    }),

    needsPickup: z.boolean().default(false),

    flightNumber: z
      .string()
      .max(20, { message: "El número de vuelo no puede exceder 20 caracteres" })
      .regex(/^[A-Z0-9\s-]*$/, { message: "Formato de número de vuelo inválido" })
      .optional()
      .refine((val) => !val || val.length > 0, {
        message: "El número de vuelo es requerido cuando se solicita recogida",
      }),

    comments: z.string().max(500, { message: "Los comentarios no pueden exceder 500 caracteres" }).optional(),

    adults: z.coerce
      .number()
      .min(1, { message: "Se requiere al menos 1 adulto" })
      .max(10, { message: "Máximo 10 adultos permitidos" })
      .default(1),

    children: z.coerce
      .number()
      .min(0, { message: "El número no puede ser negativo" })
      .max(10, { message: "Máximo 10 niños permitidos" })
      .default(0),

    babies: z.coerce
      .number()
      .min(0, { message: "El número no puede ser negativo" })
      .max(5, { message: "Máximo 5 bebés permitidos" })
      .default(0),

    paymentMethod: z
      .enum(["cash", "transfer"], {
        required_error: "Por favor selecciona un método de pago",
      })
      .default("cash"),
  })
  .refine(
    (data) => {
      // If needsPickup is true, flightNumber should be provided
      return !data.needsPickup || (data.flightNumber && data.flightNumber.length > 0)
    },
    {
      message: "El número de vuelo es requerido cuando se solicita recogida",
      path: ["flightNumber"],
    },
  )
  .refine(
    (data) => {
      // Check if total guests doesn't exceed a reasonable limit
      return data.adults + data.children + data.babies <= 15
    },
    {
      message: "El número total de huéspedes no puede exceder 15",
      path: ["adults"],
    },
  )

export type BookingFormValues = z.infer<typeof bookingSchema>

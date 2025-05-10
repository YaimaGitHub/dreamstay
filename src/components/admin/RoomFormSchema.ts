
import * as z from "zod";

export const roomFormSchema = z.object({
  title: z.string().min(3, {
    message: "El título debe tener al menos 3 caracteres",
  }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo",
  }),
  rating: z.coerce.number().min(0).max(5),
  reviews: z.coerce.number().int().nonnegative(),
  image: z.string().url({
    message: "Debe ser una URL de imagen válida",
  }).optional(),
  type: z.string().min(1, {
    message: "Seleccione un tipo de habitación",
  }),
  area: z.coerce.number().positive({
    message: "El área debe ser un número positivo",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres",
  }),
  isAvailable: z.boolean().default(true),
  features: z.array(z.string()).min(1, {
    message: "Agregue al menos una característica",
  }),
  lastModified: z.date().optional().default(() => new Date()),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;

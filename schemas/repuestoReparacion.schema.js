import z from "zod";

const repuestoReparacionSchema = z.object({
  reparacion_id: z.number().int().positive(),
  nombre: z.string().min(3).max(255),
  cantidad: z.number().int().positive(),
  precio: z.number().positive()
})

export function validateRepuestoReparacion(input){
  return repuestoReparacionSchema.safeParse(input);
}

export function validatePartialRepuestoReparacion(input){
  return repuestoReparacionSchema.partial().safeParse(input);
}
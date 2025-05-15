import z from "zod";

const reparacionSchema = z.object({
  indemnizacion_id: z.number().int().positive(),
  taller_rif: z.string().length(10),
  descripcion: z.string().min(5).max(450),
  monto: z.number().positive()
})

export function validateReparacion(input){
  return reparacionSchema.safeParse(input);
}

export function validatePartialReparacion(input){
  return reparacionSchema.partial().safeParse(input);
}
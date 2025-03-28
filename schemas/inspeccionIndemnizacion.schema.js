import z from "zod";

const inspeccionIndemnizacionSchema = z.object({
  indemnizacion_id: z.number().int().positive(),
  inspector_doc: z.string().min(5).max(255),
  descripcion: z.string().min(5).max(450),
  fecha: z.string().date()
})

export function validateInspeccionIndemnizacion(input){
  return inspeccionIndemnizacionSchema.safeParse(input);
}

export function validatePartialInspeccionIndemnizacion(input){
  return inspeccionIndemnizacionSchema.partial().safeParse(input);
}
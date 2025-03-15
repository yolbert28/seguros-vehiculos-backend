import z from "zod";

const indemnizacionSchema = z.object({
  siniestro_id: z.number().int().positive(),
  descripcion: z.string().min(5).max(450),
  monto_reclamado: z.number().positive()
})

export function validateIndemnizacion(input){
  return indemnizacionSchema.safeParse(input);
}

export function validatePartialIndemnizacion(input){
  return indemnizacionSchema.partial().safeParse(input);
}
import z from "zod";

const repuestoSiniestroSchema = z.object({
  inspeccion_siniestro_id: z.number().int().positive(),
  nombre: z.string().min(5).max(255),
  cantidad: z.number().int().positive()
})

export function validateRepuestoSiniestro(input){
  return repuestoSiniestroSchema.safeParse(input);
}

export function validatePartialRepuestoSiniestro(input){
  return repuestoSiniestroSchema.partial().safeParse(input);
}
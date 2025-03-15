import z from "zod";

const evidenciaSchema = z.object({
  siniestro_id: z.number().int().positive(),
  tipo_evidencia: z.number().int().positive(),
  ruta_archivo: z.string().min(5).max(255)
})

export function validateEvidencia(input){
  return evidenciaSchema.safeParse(input);
}

export function validatePartialEvidencia(input){
  return evidenciaSchema.partial().safeParse(input);
}
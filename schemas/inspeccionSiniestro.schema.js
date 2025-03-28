import z from "zod";

const inspeccionSiniestroSchema = z.object({
  siniestro_id: z.number().int().positive(),
  inspector_doc: z.string().min(7).max(11),
  descripcion: z.string().min(5).max(450),
  fecha: z.string().date()
})

export function validateInspeccionSiniestro(input){
  return inspeccionSiniestroSchema.safeParse(input);
}

export function validatePartialInspeccionSiniestro(input){
  return inspeccionSiniestroSchema.partial().safeParse(input);
}
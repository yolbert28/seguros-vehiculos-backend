import z from "zod";

const siniestroSchema = z.object({
  reporte_siniestro_id: z.number().int().positive(),
  vehiculo_mat: z.string().min(1).max(10),
  descripcion: z.string().min(5).max(450),
  lugar: z.string().min(5).max(255),
  monto_estimado: z.number().int().positive(),
  tipo_siniestro_id: z.number().int().positive(),
  fecha: z.string().date(),
  estado: z.number().int().positive()
})

export function validateSiniestro(input){
  return siniestroSchema.safeParse(input);
}

export function validatePartialSiniestro(input){
  return siniestroSchema.partial().safeParse(input);
}
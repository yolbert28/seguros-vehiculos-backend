import z from "zod";

const reporteSiniestroSchema = z.object({
  cliente_doc: z.string().min(7).max(11),
  descripcion: z.string().min(5).max(450),
  direccion: z.string().min(5).max(450),
  fecha: z.string().date(),
  atendido: z.boolean().optional()
})

export function validateReporteSiniestro(input){
  return reporteSiniestroSchema.safeParse(input);
}

export function validatePartialReporteSiniestro(input){
  return reporteSiniestroSchema.partial().safeParse(input);
}
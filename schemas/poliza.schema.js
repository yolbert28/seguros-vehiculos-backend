import z from "zod";

const polizaSchema = z.object({
  cliente_doc: z.string().min(7).max(11),
  asesor_doc: z.string().min(7).max(11),
  fecha_fin: z.string().date(),
  tipo_pago: z.number().int().positive(),
})

export function validatePoliza(input) {
  return polizaSchema.safeParse(input);
}

export function validatePartialPoliza(input) {
  return polizaSchema.partial().safeParse(input);
}

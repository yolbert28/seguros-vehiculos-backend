import z from "zod";

const pagoReparacionSchema = z.object({
  reparacion_id: z.number().int().positive(),
  pagante: z.number().int().positive(),
  monto: z.number().positive(),
  fecha: z.string().date()
})

export function validatePagoReparacion(input){
  return pagoReparacionSchema.safeParse(input);
}

export function validatePartialPagoReparacion(input){
  return pagoReparacionSchema.partial().safeParse(input);
}
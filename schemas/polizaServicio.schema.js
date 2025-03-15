import z from "zod";

const polizaServicioSchema = z.object({
  servicio_id: z.number().int().positive(),
  poliza_id: z.number().int().positive(),
});


export function validatePolizaServicio(input) {
  return  polizaServicioSchema.safeParse(input);
}

export function validatePartialPolizaServicio(input) {
  return polizaServicioSchema.partial().safeParse(input);
}
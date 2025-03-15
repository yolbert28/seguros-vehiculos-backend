import z from "zod";

const primaSchema = z.object({
  poliza_id: z.number().int().positive(),
  monto: z.number().positive(),
  fecha: z.date(),
});

export function validatePrima(input) {
  return primaSchema.safeParse(input);
}

export function validatePartialPrima(input) {
  return primaSchema.partial().safeParse(input);
}
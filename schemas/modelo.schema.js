import z from 'zod';

const modeloSchema = z.object({
  marca_id: z.number().int().positive(),
  nombre: z.string().min(1).max(255),
})

export function validateModelo(input) {
  return modeloSchema.safeParse(input);
}

export function validatePartialModelo(input) {
  return modeloSchema.partial().safeParse(input);
}
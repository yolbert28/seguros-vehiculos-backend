import z from "zod";

const coberturaSchema = z.object({
  nombre: z.string().min(2).max(255),
  descripcion: z.string().min(2).max(255),
});

export function validateCobertura(input) {
  return coberturaSchema.safeParse(input);
}

export function validatePartialCobertura(input) {
  return coberturaSchema.partial().safeParse(input);
}
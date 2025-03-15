import z from "zod";

const marcaSchema = z.object({
  nombre: z.string().min(2).max(255),
})

export function validateMarca(input) {
  return marcaSchema.safeParse(input);
}
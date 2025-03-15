import z from "zod";

const servicioSchema = z.object({
  nombre: z.string().min(2).max(255),
  descripcion: z.string().min(2).max(255),
  monto: z.number().nonnegative(),
});

export function validateServicio(input) {
  return servicioSchema.safeParse(input);
}

export function validatePartialServicio(input) {
  return servicioSchema.partial().safeParse(input);
}
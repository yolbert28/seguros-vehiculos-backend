import z from "zod";

const tallerSchema = z.object({
  nombre: z.string().min(5).max(255),
  direccion: z.string().min(5).max(450),
  correo: z.email(),
  telefono: z.string().min(10).max(11),
})

export function validateTaller(input){
  return tallerSchema.safeParse(input);
}

export function validatePartialTaller(input){
  return tallerSchema.partial().safeParse(input);
}
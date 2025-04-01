import z from "zod"

const credencialesSchema = z.object({
  documento: z.string().min(7).max(11),
  contrasena: z.string().min(6).max(255)
})

export function validateCredenciales(input) {
  return credencialesSchema.safeParse(input)
}
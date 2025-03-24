import z from "zod";

const empleadoSchema = z.object({
  documento: z.string().min(7).max(11),
  nombre: z.string().max(255),
  correo: z.string().email(),
  telefono: z.string().min(10).max(11),
  tipo_empleado: z.number().int().positive(),
  contrasena: z.string().min(6).max(255),
});

export function validateEmpleado(input){
  return empleadoSchema.safeParse(input);
}

export function validatePartialEmpleado(input){
  return empleadoSchema.partial().safeParse(input);
}
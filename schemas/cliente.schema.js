import { z } from 'zod';

const clienteSchema = z.object({
  documento: z.string().min(7).max(11),
  nombre: z.string().min(3).max(255),
  correo: z.string().email(),
  telefono: z.string().min(10).max(11),
  direccion: z.string().min(3).max(450),
  contrasena: z.string().min(6).max(255),
});

export function validateCliente(input) {
  return clienteSchema.safeParse(input);
}

export function validatePartialCliente(input) {
  return clienteSchema.partial().safeParse(input);
}
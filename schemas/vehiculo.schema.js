import z from "zod";

const vehiculoSchema = z.object({
  matricula: z.string().min(1).max(10),
  poliza_id: z.number().int().positive(),
  modelo_id: z.number().int().positive(),
  riesgo_id: z.number().int().positive(),
  capacidad: z.number().int().positive(),
  anno: z.number().int().positive(),
  valoracion: z.number().positive(),
  ultima_actualizacion: z.date().optional(),
});

export function validateVehiculo(input) {
  return vehiculoSchema.safeParse(input);
}

export function validatePartialVehiculo(input) {
  return vehiculoSchema.partial().safeParse(input);
}
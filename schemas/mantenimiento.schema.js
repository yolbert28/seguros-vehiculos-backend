import z from "zod";

const mantenimientoSchema = z.object({
  vehiculo_mat: z.string().min(1).max(10),
  taller_rif: z.string().length(10),
  descripcion: z.string().min(5).max(450),
  fecha: z.string().date()
});

export function validateMantenimiento(input){
  return mantenimientoSchema.safeParse(input);
}

export function validatePartialMantenimiento(input){
  return mantenimientoSchema.partial().safeParse(input);
}
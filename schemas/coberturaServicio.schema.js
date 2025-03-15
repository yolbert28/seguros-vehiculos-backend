import z from "zod";

const coberturaServicioSchema = z.object({
  cobertura_id: z.number().int().positive(),
  servicio_id: z.number().int().positive(),
});

export function validateCoberturaServicio(input){
  return coberturaServicioSchema.safeParse(input);
}

export function validatePartialCoberturaServicio(input){
  return coberturaServicioSchema.partial().safeParse(input);
}
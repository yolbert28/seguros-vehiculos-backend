import { Router } from "express";
import IndemnizacionController from "../controllers/indemnizacion.controller.js";

export default function createIndemnizacionRouter({ indemnizacionModel, siniestroModel, reparacionModel, inspeccionIndemnizacionModel, }) {
  const route = Router();

  const indemnizacionController = new IndemnizacionController({ indemnizacionModel, siniestroModel, reparacionModel, inspeccionIndemnizacionModel, });

  route.get("/", indemnizacionController.getAll);
  route.get("/:id", indemnizacionController.getById);
  route.get("/siniestro/:id", indemnizacionController.getBySiniestroId);
  route.post("/", indemnizacionController.create);
  route.put("/:id", indemnizacionController.update);
  route.delete("/:id", indemnizacionController.delete);

  return route;
}
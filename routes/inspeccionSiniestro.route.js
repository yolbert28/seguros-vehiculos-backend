import { Router } from "express";
import InspeccionSiniestroController from "../controllers/inspeccionSiniestro.controller.js";

export default function createInspeccionSiniestroRouter({ inspeccionSiniestroModel, siniestroModel, empleadoModel, repuestoSiniestroModel }){
  const route = Router();

  const inspeccionSiniestroController = new InspeccionSiniestroController({ inspeccionSiniestroModel, siniestroModel, empleadoModel, repuestoSiniestroModel });

  route.get("/", inspeccionSiniestroController.getAll);
  route.get("/:id", inspeccionSiniestroController.getById);
  route.get("/siniestro/:id", inspeccionSiniestroController.getBySiniestroId);
  route.get("/inspector/:doc", inspeccionSiniestroController.getByInspectorDoc);
  route.post("/", inspeccionSiniestroController.create);
  route.put("/:id", inspeccionSiniestroController.update);
  route.delete("/:id", inspeccionSiniestroController.delete);

  return route;
}
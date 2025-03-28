import { Router } from "express";
import InspeccionIndemnizacionController from "../controllers/inspeccionIndemnizacion.controller";

export default function createInspeccionIndemnizacionRouter({ inspeccionIndemnizacionModel, indemnizacionModel, empleadoModel }) {
  const route = Router();

  const inspeccionIndemnizacionController = new InspeccionIndemnizacionController({ inspeccionIndemnizacionModel, indemnizacionModel, empleadoModel });

  route.get("/", inspeccionIndemnizacionController.getAll);
  route.get("/:id", inspeccionIndemnizacionController.getById);
  route.get("/indemnizacion/:id", inspeccionIndemnizacionController.getByIndemnizacion);
  route.get("/inspector/:doc", inspeccionIndemnizacionController.getByInspectorDoc);
  route.post("/", inspeccionIndemnizacionController.create);
  route.put("/:id", inspeccionIndemnizacionController.update);
  route.delete("/:id", inspeccionIndemnizacionController.delete);

  return route;
}
import { Router } from "express";
import RepuestoReparacionController from "../controllers/repuestoReparacion.controller.js";

export default function createRepuestoReparacionRouter({ repuestoReparacionModel, reparacionModel }) {
  const route = Router();

  const repuestoReparacionController = new RepuestoReparacionController({ repuestoReparacionModel, reparacionModel });

  route.get("/", repuestoReparacionController.getAll);
  route.get("/:id", repuestoReparacionController.getById);
  route.get("/reparacion/:reparacion_id", repuestoReparacionController.getByReparacion);
  route.post("/", repuestoReparacionController.create);
  route.put("/:id", repuestoReparacionController.update);
  route.delete("/:id", repuestoReparacionController.delete);

  return route;
}
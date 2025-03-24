import { Router } from "express";
import RepuestoSiniestroController from "../controllers/repuestoSiniestro.controller.js";

export default function createRepuestoSiniestroRouter({ repuestoSiniestroModel }) {
  const route = Router();

  const repuestoSiniestroController = new RepuestoSiniestroController({ repuestoSiniestroModel })

  route.get("/", repuestoSiniestroController.getAll);
  route.get("/:id", repuestoSiniestroController.getById);
  route.get("/inspection/:id", repuestoSiniestroController.getByInspeccion);
  route.post("/", repuestoSiniestroController.create);
  route.put("/:id", repuestoSiniestroController.update);
  route.delete("/:id", repuestoSiniestroController.delete);

  return route;
}
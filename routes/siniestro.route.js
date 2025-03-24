import { Router } from "express";
import SiniestroController from "../controllers/siniestro.controller.js";

export default function createSiniestroRouter({ siniestroModel, reporteSiniestroModel, vehiculoModel }) {
  const route = Router();

  const siniestroController = new SiniestroController({ siniestroModel, reporteSiniestroModel, vehiculoModel });

  route.get("/", siniestroController.getAll);
  route.get("/:id", siniestroController.getById);
  route.get("/vehiculo/:matricula", siniestroController.getByVehiculo);
  route.post("/", siniestroController.create);
  route.put("/:id", siniestroController.update);
  route.delete("/:id", siniestroController.delete);

  return route;
}
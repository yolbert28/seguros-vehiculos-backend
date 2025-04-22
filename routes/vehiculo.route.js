import { Router } from "express";
import VehiculoController from "../controllers/vehiculo.controller.js";

export default function createVehiculoRouter({ vehiculoModel, polizaModel, siniestroModel, mantenimientoModel, modeloModel }) {
  const route = Router();

  const vehiculoController = new VehiculoController({ vehiculoModel, polizaModel, siniestroModel, mantenimientoModel, modeloModel });

  route.get("/", vehiculoController.getAll);
  route.get("/:id", vehiculoController.getById);
  route.get("/poliza/:id", vehiculoController.getByPoliza);
  route.post("/", vehiculoController.create);
  route.put("/:id", vehiculoController.update);
  route.delete("/:id", vehiculoController.delete);

  return route;
}
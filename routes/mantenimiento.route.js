import { Router } from "express";
import MantenimientoController from "../controllers/mantenimiento.controller.js";

export default function createMantenimientoRouter({ mantenimientoModel, vehiculoModel, tallerModel }){
  const route = Router();

  const mantenimientoController = new MantenimientoController({ mantenimientoModel, vehiculoModel, tallerModel });

  route.get("/", mantenimientoController.getAll);
  route.get("/:id", mantenimientoController.getById);
  route.get("/vehicle/:matricula", mantenimientoController.getByVehiculo);
  route.get("/taller/:rif", mantenimientoController.getByTaller);
  route.post("/", mantenimientoController.create);
  route.put("/:id", mantenimientoController.update);
  route.delete("/:id", mantenimientoController.delete);

  return route;
}
import { Router } from "express";
import ReparacionController from "../controllers/reparacion.controller.js";

export default function createReparacionRouter({ reparacionModel, indemnizacionModel, tallerModel, pagoReparacionModel, repuestoReparacionModel }){
  const route = Router();

  const reparacionController = new ReparacionController({ reparacionModel, indemnizacionModel, tallerModel, pagoReparacionModel, repuestoReparacionModel });

  route.get("/", reparacionController.getAll);
  route.get("/:id", reparacionController.getById);
  route.get("/taller/:rif", reparacionController.getByTaller);
  route.get("/indemnizacion/:id", reparacionController.getByIndemnizacion);
  route.post("/", reparacionController.create);
  route.put("/:id", reparacionController.update);
  route.delete("/:id", reparacionController.delete);

  return route;
}
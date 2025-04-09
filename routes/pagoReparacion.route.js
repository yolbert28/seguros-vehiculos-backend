import { Router } from "express";
import PagoReparacionController from "../controllers/pagoReparacion.controller.js";

export default function createPagoReparacionRouter({ pagoReparacionModel, reparacionModel }) {
  const route = Router();

  const pagoReparacionController = new PagoReparacionController({ pagoReparacionModel, reparacionModel });

  route.get("/", pagoReparacionController.getAll);
  route.get("/:id", pagoReparacionController.getById);
  route.get("/reparacion/:reparacionId", pagoReparacionController.getByReparacion);
  route.post("/", pagoReparacionController.create);
  route.put("/:id", pagoReparacionController.update);
  route.delete("/:id", pagoReparacionController.delete);

  return route;
}
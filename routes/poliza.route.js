import { Router } from "express";
import PolizaController from "../controllers/poliza.controller.js";

export default function createPolizaRouter({polizaModel,empleadoModel}){
  const route = Router();

  const polizaController = new PolizaController({polizaModel,empleadoModel});

  route.get("/", polizaController.getAll);
  route.get("/:id", polizaController.getById);
  route.post("/", polizaController.create);
  route.put("/:id", polizaController.update);
  route.delete("/:id", polizaController.delete);
  route.post("/:id/:servicioId", polizaController.addServicio);
  route.delete("/:id/:servicioId", polizaController.removeServicio);

  return route;
}
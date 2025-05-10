import { Router } from "express";
import PolizaController from "../controllers/poliza.controller.js";

export default function createPolizaRouter({ polizaModel, empleadoModel, coberturaPolizaModel, coberturaModel, vehiculoModel, primaModel }) {
  const route = Router();

  const polizaController = new PolizaController({ polizaModel, empleadoModel, coberturaPolizaModel, coberturaModel, vehiculoModel, primaModel });

  route.get("/", polizaController.getAll);
  route.get("/:id", polizaController.getById);
  route.get("/client/:document", polizaController.getByCliente)
  route.post("/", polizaController.create);
  route.put("/:id", polizaController.update);
  route.delete("/:id", polizaController.delete);
  route.post("/:id/:coberturaId", polizaController.addCobertura);
  route.delete("/:id/:coberturaId", polizaController.removeCobertura);

  return route;
}
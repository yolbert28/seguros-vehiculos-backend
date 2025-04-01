import { Router } from "express";
import ServicioController from "../controllers/servicio.controller.js";

export default function createServicioRouter({ servicioModel }) {
  const router = Router();

  const servicioController = new ServicioController({ servicioModel });

  router.get("/", servicioController.getAll);
  router.get("/:id", servicioController.getById);
  router.post("/", servicioController.create);
  router.put("/:id", servicioController.update);
  router.delete("/:id", servicioController.delete);
  router.post("/:id/:coberturaId", servicioController.addCobertura());
  router.delete("/:id/:coberturaId", servicioController.removeCobertura());

  return router;
}
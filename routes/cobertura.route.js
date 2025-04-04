import { Router } from "express";
import CoberturaController from "../controllers/cobertura.controller.js";

export default function createCoberturaRouter({ coberturaModel, coberturaServicioModel }) {
  const router = Router();

  const coberturaController = new CoberturaController({ coberturaModel });

  router.get("/", coberturaController.getAll);
  router.get("/:id", coberturaController.getById);
  router.post("/", coberturaController.create);
  router.put("/:id", coberturaController.update);
  router.delete("/:id", coberturaController.delete);

  return router;
}
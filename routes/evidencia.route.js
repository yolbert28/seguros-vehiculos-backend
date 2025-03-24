import { Router } from "express";
import EvidenciaController from "../controllers/evidencia.controller.js";

export default function createEvidenciaRouter({ evidenciaModel, siniestroModel }) {
  const route = Router();

  const evidenciaController = new EvidenciaController({ evidenciaModel, siniestroModel });

  route.get("/", evidenciaController.getAll);
  route.get("/:id", evidenciaController.getById);
  route.get("/siniestro/:id", evidenciaController
  .getBySiniestro);
  route.post("/", evidenciaController.create);
  route.put("/:id", evidenciaController.update);
  route.delete("/:id", evidenciaController.delete);

  return route;
}
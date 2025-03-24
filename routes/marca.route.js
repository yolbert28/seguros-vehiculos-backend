import { Router } from "express";
import MarcaController from "../controllers/marca.controller.js";

export default function createMarcaRouter({ marcaModel }) {
  const router = Router();

  const marcaController = new MarcaController({ marcaModel });

  router.get("/", marcaController.getAll);
  router.get("/:id", marcaController.getById);
  router.post("/", marcaController.create);
  router.put("/:id", marcaController.update);
  router.delete("/:id", marcaController.delete);

  return router;
}
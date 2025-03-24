import { Router } from "express";
import PrimaController from "../controllers/prima.controller.js";

export default function createPrimaRouter({ primaModel, polizaModel }) {
  const route = Router();

  const primaController = new PrimaController({ primaModel, polizaModel });

  route.get("/", primaController.getAll);
  route.get("/:id", primaController.getById);
  route.post("/", primaController.create);
  route.put("/:id", primaController.update);
  route.delete("/:id", primaController.delete);

  return route;
}
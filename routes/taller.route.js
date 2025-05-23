import { Router } from "express";
import TallerController from "../controllers/taller.controller.js";

export default function createTallerRouter({ tallerModel, reparacionModel, mantenimientoModel }){
  const route = Router();

  const tallerController = new TallerController({ tallerModel, reparacionModel, mantenimientoModel });

  route.get("/", tallerController.getAll);
  route.get("/:rif", tallerController.getById);
  route.get("/name/:name", tallerController.getByName);
  route.post("/", tallerController.create);
  route.put("/:rif", tallerController.update);
  route.delete("/:rif", tallerController.delete);

  return route;
}
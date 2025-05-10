import { Router } from "express";
import RiesgoController from "../controllers/riesgo.controller.js";

export default function createRiesgoRouter({riesgoModel}) {

  const route = Router();

  const riesgoController = new RiesgoController({riesgoModel});

  route.get("/", riesgoController.getAll);

  return route;
}
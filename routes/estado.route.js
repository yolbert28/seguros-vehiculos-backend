import { Router } from "express";
import EstadoController from "../controllers/estado.controller.js";

export default function createEstadoRouter({estadoModel}) {

  const route = Router();

  const estadoController = new EstadoController({estadoModel});

  route.get("/", estadoController.getAll);

  return route;
}
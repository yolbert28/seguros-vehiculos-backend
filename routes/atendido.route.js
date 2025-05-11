import { Router } from "express";
import AtendidoController from "../controllers/atendido.controller.js";

export default function createAtendidoRouter({atendidoModel}) {

  const route = Router();

  const atendidoController = new AtendidoController({atendidoModel});

  route.get("/", atendidoController.getAll);

  return route;
}
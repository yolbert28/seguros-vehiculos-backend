import { Router } from "express";
import TipoEmpleadoController from "../controllers/tipoEmpleado.controller.js";

export default function createTipoEmpleadoRouter({tipoEmpleadoModel}) {

  const route = Router();

  const tipoEmpleadoController = new TipoEmpleadoController({tipoEmpleadoModel});

  route.get("/", tipoEmpleadoController.getAll);

  return route;
}
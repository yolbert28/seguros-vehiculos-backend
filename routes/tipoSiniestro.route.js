import { Router } from "express";
import TipoSiniestroController from "../controllers/tipoSiniestro.controller.js";

export default function createTipoSiniestroRouter({tipoSiniestroModel}) {

  const route = Router();

  const tipoSiniestroController = new TipoSiniestroController({tipoSiniestroModel});

  route.get("/", tipoSiniestroController.getAll);

  return route;
}
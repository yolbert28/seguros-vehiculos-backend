import { Router } from "express";
import TipoEvidenciaController from "../controllers/tipoEvidencia.controller.js";

export default function createTipoEvidenciaRouter({tipoEvidenciaModel}) {

  const route = Router();

  const tipoEvidenciaController = new TipoEvidenciaController({tipoEvidenciaModel});

  route.get("/", tipoEvidenciaController.getAll);

  return route;
}
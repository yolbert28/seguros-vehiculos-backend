import { Router } from "express";
import PaganteController from "../controllers/pagante.controller.js";

export default function createPaganteRouter({paganteModel}) {

  const route = Router();

  const paganteController = new PaganteController({paganteModel});

  route.get("/", paganteController.getAll);

  return route;
}
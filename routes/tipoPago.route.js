import { Router } from "express";
import TipoPagoController from "../controllers/tipoPago.controller.js";

export default function createTipoPagoRouter({tipoPagoModel}) {

  const route = Router();

  const tipoPagoController = new TipoPagoController({tipoPagoModel});

  route.get("/", tipoPagoController.getAll);

  return route;
}
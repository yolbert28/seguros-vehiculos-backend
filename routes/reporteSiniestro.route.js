import { Router } from "express";
import ReporteSiniestroController from "../controllers/reporteSiniestro.controller.js";

export default function createReporteSiniestroRouter({ reporteSiniestroModel, clienteModel }) {
  const route = Router();

  const reporteSiniestroController = new ReporteSiniestroController({ reporteSiniestroModel, clienteModel });

  route.get("/", reporteSiniestroController.getAll);
  route.get("/:id", reporteSiniestroController.getById);
  route.get("/cliente/:documento", reporteSiniestroController.getByCliente);
  route.post("/", reporteSiniestroController.create);
  route.put("/:id", reporteSiniestroController.update);
  route.delete("/:id", reporteSiniestroController.delete);

  return route;
}
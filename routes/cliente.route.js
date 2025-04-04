import { Router } from "express";
import ClienteController from "../controllers/cliente.controller.js";

export default function createClienteRouter({ clienteModel, polizaModel, reporteSiniestroModel }){
  const router = Router();

  const clienteController = new ClienteController({ clienteModel, polizaModel, reporteSiniestroModel });

  router.get("/", clienteController.getAll);
  router.get("/:documento", clienteController.getById);
  router.get("/email/:correo", clienteController.getByEmail);
  router.post("/", clienteController.create);
  router.put("/:documento", clienteController.update);
  router.delete("/:documento", clienteController.delete);
  router.put("/password/:documento", clienteController.changePassword);

  return router;
}
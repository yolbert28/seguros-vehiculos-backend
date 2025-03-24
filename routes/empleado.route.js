import { Router } from "express";
import EmpleadoController from "../controllers/empleado.controller.js";

export default function createEmpleadoRoute({empleadoModel}){
  const route = Router();

  const empleadoController = new EmpleadoController({empleadoModel});

  route.get("/", empleadoController.getAll);
  route.get("/:documento", empleadoController.getById);
  route.post("/", empleadoController.create);
  route.put("/password/:documento", empleadoController.changePassword);
  route.put("/:documento", empleadoController.update);
  route.delete("/:documento", empleadoController.delete);

  return route;
}
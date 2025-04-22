import { Router } from "express";
import EmpleadoController from "../controllers/empleado.controller.js";

export default function createEmpleadoRoute({ empleadoModel, inspeccionSiniestroModel, inspeccionIndemnizacionModel, polizaModel  }){
  const route = Router();

  const empleadoController = new EmpleadoController({ empleadoModel, inspeccionSiniestroModel, inspeccionIndemnizacionModel, polizaModel  });

  route.get("/", empleadoController.getAll);
  route.get("/:documento", empleadoController.getById);
  route.get("/report/:year/:month", empleadoController.getReportByMonth);
  route.get("/report/:year", empleadoController.getReportByYear);
  route.post("/", empleadoController.create);
  route.post("/login", empleadoController.login);
  route.put("/password/:documento", empleadoController.changePassword);
  route.put("/:documento", empleadoController.update);
  route.delete("/:documento", empleadoController.delete);

  return route;
}
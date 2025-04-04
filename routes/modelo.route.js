import { Router } from "express";
import ModeloController from "../controllers/modelo.controller.js";

export default function createModeloRouter({ modeloModel, marcaModel, vehiculoModel }) {
  const router = Router();

  const modeloController = new ModeloController({ modeloModel, marcaModel, vehiculoModel });

  router.get('/', modeloController.getAll);
  router.get('/:id', modeloController.getById);
  router.post('/', modeloController.create);
  router.put('/:id', modeloController.update);
  router.delete('/:id', modeloController.delete);

  return router;
}
import { validateReparacion } from "../schemas/reparacion.schema";

export default class reparacionController {
  constructor({ reparacionModel }) {
    this.reparacionModel = reparacionModel;
  }

  getAll = async (req, res) => {
    const reparaciones = await this.reparacionModel.getAll();

    res.json(reparaciones);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const reparacion = await this.reparacionModel.getById(id);

    res.json(reparacion);
  }

  getByIndemnizacion = async (req, res) => {
    const { id } = req.params;
    const reparaciones = await this.reparacionModel.getByIndemnizacion(id);

    res.json(reparaciones);
  }

  create = async (req, res) => {
    const newReparacion = validateReparacion(req.body);

    if(!newReparacion.success){
      return res.status(400).json({error: newReparacion.error});
    }

    const result = await this.reparacionModel.create(newReparacion.data);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ message: "Error al crear la reparacion" });
    }
  }

  update = async (req, res) => {
    const { id } = req.params;
    const reparacion = req.body;
    const result = await this.reparacionModel.update(id, reparacion);

    if (result) {
      res.json({ message: "Reparacion actualizada" });
    } else {
      res.status(500).json({ message: "Error al actualizar la reparacion" });
    }
  }

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.reparacionModel.delete(id);

    if (result) {
      res.json({ message: "Reparacion eliminada" });
    } else {
      res.status(500).json({ message: "Error al eliminar la reparacion" });
    }
  }
}
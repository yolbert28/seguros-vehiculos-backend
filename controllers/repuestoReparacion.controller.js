import { validatePartialRepuestoReparacion, validateRepuestoReparacion } from "../schemas/repuestoReparacion.schema.js";

export default class RepuestoReparacionController {
  constructor({ repuestoReparacionModel, reparacionModel }) {
    this.repuestoReparacionModel = repuestoReparacionModel;
    this.reparacionModel = reparacionModel;
  }

  getAll = async (req, res) => {
    const result = await this.repuestoReparacionModel.getAll();

    res.json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const result = await this.repuestoReparacionModel.getById(id);

    res.json(result);
  }

  getByReparacion = async (req, res) => {
    const { reparacion_id } = req.params;
    const result = await this.repuestoReparacionModel.getByReparacion(reparacion_id);

    res.json(result);
  }

  create = async (req, res) => {
    const repuestoReparacion = validateRepuestoReparacion(req.body);

    if (!repuestoReparacion.success) {
      return res.status(400).json(repuestoReparacion.error);
    }

    const reparacionExist = await this.reparacionModel.getById(repuestoReparacion.data.reparacion_id);

    if (!reparacionExist) {
      return res.status(400).json({ success: false, error: "La reparacion no existe" });
    }

    const result = await this.repuestoReparacionModel.create(repuestoReparacion.data);

    if (!result.success) {
      return res.status(500).json({ success: false, error: "Error al crear el repuesto de la reparacion" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const repuestoReparacion = validatePartialRepuestoReparacion(req.body);

    if (!repuestoReparacion.success) {
      return res.status(400).json(repuestoReparacion.error);
    }

    const result = await this.repuestoReparacionModel.update(id, repuestoReparacion.data);

    if (!result) {
      return res.status(500).json({ error: "Error al actualizar el repuesto de la reparacion" });
    }

    res.json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.repuestoReparacionModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el repuesto de la reparacion" });
    }

    res.json({ success: true });
  }

}
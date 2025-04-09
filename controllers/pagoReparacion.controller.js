import { validatePagoReparacion, validatePartialPagoReparacion } from "../schemas/pagoReparacion.schema.js";

export default class PagoReparacionController {
  constructor({ pagoReparacionModel, reparacionModel }) {
    this.pagoReparacionModel = pagoReparacionModel;
    this.reparacionModel = reparacionModel;
  }

  getAll = async (req, res) => {
    const pagosReparacion = await this.pagoReparacionModel.getAll();

    res.json(pagosReparacion);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const pagoReparacion = await this.pagoReparacionModel.getById(id);

    res.json(pagoReparacion);
  }

  getByReparacion = async (req, res) => {
    const { reparacionId } = req.params;
    const pagosReparacion = await this.pagoReparacionModel.getByReparacion(reparacionId);

    res.json(pagosReparacion);
  }

  create = async (req, res) => {
    const pagoReparacion = validatePagoReparacion(req.body);

    if (!pagoReparacion.success) {
      return res.status(400).json({ error: pagoReparacion.error });
    }

    const reparacionExist = await this.reparacionModel.getById(pagoReparacion.data.reparacion_id);

    if (!reparacionExist) {
      return res.status(400).json({ error: "Reparacion no existe" });
    }

    const result = await this.pagoReparacionModel.create(pagoReparacion.data);

    if (!result.success) {
      return res.status(500).json({ error: "Error al crear el pago" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const pagoReparacion = validatePartialPagoReparacion(req.body);

    if (!pagoReparacion.success) {
      return res.status(400).json({ error: pagoReparacion.error });
    }

    const result = await this.pagoReparacionModel.update(id, pagoReparacion.data);

    if(!result)
      return res.status(500).json({ success: false, error: "Error al actualizar el pago" });

    res.json({success: true});
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.pagoReparacionModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el pago" });
    }

    res.status(200).json({ success: true });
  }
}
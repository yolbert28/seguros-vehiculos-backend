import { validatePartialPrima, validatePrima } from "../schemas/prima.schema.js";

export default class PrimaController {
  constructor({ primaModel, polizaModel }) {
    this.primaModel = primaModel;
    this.polizaModel = polizaModel;
  }

  getAll = async (req, res) => {
    const result = await this.primaModel.getAll();

    return res.status(200).json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.primaModel.getById(id);

    return res.status(200).json(result);
  }

  create = async (req, res) => {
    const newPrima = validatePrima(req.body);

    if (!newPrima.success) {
      return res.status(400).json({ error: newPrima.error })
    }

    const polizaExist = this.polizaModel.getById(newPrima.data.poliza_id)

    if (!polizaExist) {
      return res.status(400).json({ error: "No existe la poliza" })
    }

    const result = await this.primaModel.create(newPrima.data)

    if (!result.success) {
      return res.status(500).json({ error: "No se pudo crear la prima" })
    }

    return res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newPrima = validatePartialPrima(req.body);

    if (!newPrima.success) {
      return res.status(400).json({ error: newPrima.error })
    }

    const result = await this.primaModel.update(id, newPrima.data)

    if (!result) {
      return res.status(500).json({ error: "No se pudo actualizar la prima" })
    }

    return res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const primaExist = await this.primaModel.getById(id)

    if (!primaExist) {
      return res.status(404).json({ success: false, error: "No existe una prima con ese id" })
    }

    const result = await this.primaModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar la prima" });
    }

    return res.status(200).json({ success: result });
  }
}
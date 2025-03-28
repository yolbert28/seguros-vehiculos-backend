import { validateIndemnizacion, validatePartialIndemnizacion } from "../schemas/indemnizacion.schema.js";

export default class IndemnizacionController {
  constructor({ indemnizacionModel, siniestroModel }) {
    this.indemnizacionModel = indemnizacionModel;
    this.siniestroModel = siniestroModel;
  }

  getAll = async (req, res) => {
    const indemnizaciones = await this.indemnizacionModel.getAll();

    res.json(indemnizaciones);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const indemnizacion = await this.indemnizacionModel.getById(id);

    res.json(indemnizacion);
  }

  getBySiniestroId = async (req, res) => {
    const { id } = req.params;
    const indemnizacion = await this.indemnizacionModel.getBySiniestroId(id);

    res.json(indemnizacion);
  }

  create = async (req, res) => {
    const newIndemnizacion = validateIndemnizacion(req.body);

    if (!newIndemnizacion.success) {
      return res.status(400).json({ error: newIndemnizacion.error });
    }

    const siniestroExist = await this.siniestroModel.getById(newIndemnizacion.data.siniestro_id);

    if(!siniestroExist) {
      return res.status(400).json({ error: "Siniestro no existe" });
    }

    const result = await this.indemnizacionModel.create(newIndemnizacion.data);

    if(!result.success) {
      return res.status(500).json({ error: "Error al crear indemnizacion" });
    }

    res.status(201).json(result);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const indemnizacion = validatePartialIndemnizacion(req.body);

    if (!indemnizacion.success) {
      return res.status(400).json({ error: indemnizacion.error });
    }

    const result = await this.indemnizacionModel.update(id, indemnizacion.data);

    res.json(result);
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.indemnizacionModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar indemnizacion" });
    }

    res.json({ success: true });
  }
}
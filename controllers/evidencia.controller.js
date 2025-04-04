import { validateEvidencia, validatePartialEvidencia } from "../schemas/evidencia.schema.js";

export default class EvidenciaController {
  constructor({ evidenciaModel, siniestroModel }) {
    this.evidenciaModel = evidenciaModel;
    this.siniestroModel = siniestroModel;
  }

  getAll = async (req, res) => {
    const evidencias = await this.evidenciaModel.getAll();

    res.json(evidencias);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const evidencia = await this.evidenciaModel.getById(id);

    res.json(evidencia);
  }

  getBySiniestro = async (req, res) => {
    const { id } = req.params;

    const evidencias = await this.evidenciaModel.getBySiniestro(id);

    res.json(evidencias);
  }

  create = async (req, res) => {
    const newEvidencia = validateEvidencia(req.body);

    if (!newEvidencia.success) {
      return res.status(400).json({ error: newEvidencia.error });
    }

    const siniestroExist = await this.siniestroModel.getById(newEvidencia.data.siniestro_id);

    if (siniestroExist.length === 0) {
      return res.status(400).json({ error: "No existe el siniestro" });
    }

    const result = await this.evidenciaModel.create(newEvidencia.data);

    if (!result.success) {
      return res.status(400).json({ error: "Error creating evidencia" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const evidencia = validatePartialEvidencia(req.body);

    if (!evidencia.success) {
      return res.status(400).json({ error: evidencia.error });
    }

    const evidenciaExist = await this.evidenciaModel.getById(id);

    if (evidenciaExist.length === 0) {
      return res.status(400).json({ error: "No existe la evidencia" });
    }

    const result = await this.evidenciaModel.update(id, evidencia.data);

    if (!result) {
      return res.status(400).json({ error: "Error updating evidencia" });
    }

    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const evidenciaExist = await this.evidenciaModel.getById(id);

    if (!evidenciaExist) {
      return res.status(404).json({ success: false, error: "No existe una evidencia con ese id" })
    }

    const result = await this.evidenciaModel.delete(id);

    if (!result) {
      return res.status(400).json({ success: false, error: "Error deleting evidencia" });
    }

    res.status(200).json({ success: true });
  }
}
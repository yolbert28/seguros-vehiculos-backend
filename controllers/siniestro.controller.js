import { validatePartialSiniestro, validateSiniestro } from "../schemas/siniestro.schema.js";

export default class SiniestroController {

  constructor({ siniestroModel, reporteSiniestroModel, vehiculoModel, indemnizacionModel, inspeccionSiniestroModel, evidenciaModel }) {
    this.siniestroModel = siniestroModel;
    this.reporteSiniestroModel = reporteSiniestroModel;
    this.vehiculoModel = vehiculoModel;
    this.indemnizacionModel = indemnizacionModel;
    this.inspeccionSiniestroModel = inspeccionSiniestroModel;
    this.evidenciaModel = evidenciaModel;
  }

  getAll = async (req, res) => {
    const siniestros = await this.siniestroModel.getAll();

    res.json(siniestros);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const siniestro = await this.siniestroModel.getById(id);

    const evidencias = await this.evidenciaModel.getBySiniestro(id);

    const inspeccionSiniestro = await this.inspeccionSiniestroModel.getBySiniestro(id);

    const indemnizacion = await this.indemnizacionModel.getBySiniestro(id);

    if (siniestro) {
      siniestro.evidencias = evidencias;
      siniestro.inspeccionSiniestro = inspeccionSiniestro;
      siniestro.indemnizacion = indemnizacion;
    }

    res.json(siniestro);
  }

  getByVehiculo = async (req, res) => {
    const { matricula } = req.params;

    const siniestros = await this.siniestroModel.getByVehiculo(matricula);

    res.json(siniestros);
  }

  create = async (req, res) => {
    const newSiniestro = validateSiniestro(req.body);

    if (!newSiniestro.success) {
      return res.status(400).json(newSiniestro.error);
    }

    const vehiculoExist = await this.vehiculoModel.getById(newSiniestro.data.vehiculo_mat);

    if (!vehiculoExist) {
      return res.status(400).json({ message: "Vehículo no encontrado" });
    }

    const reporteSiniestroExist = await this.reporteSiniestroModel.getById(newSiniestro.data.reporte_siniestro_id);

    if (!reporteSiniestroExist) {
      return res.status(400).json({ message: "Reporte de siniestro no encontrado" });
    }

    const siniestroExist = await this.siniestroModel.getByReporteSiniestro(newSiniestro.data.reporte_siniestro_id);

    if (siniestroExist) {
      return res.status(400).json({ message: "Ya existe un siniestro asociado a este reporte" });
    }

    const result = await this.siniestroModel.create(newSiniestro.data);

    if (!result.success) {
      return res.status(500).json({ message: "Error al crear el siniestro" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const siniestro = validatePartialSiniestro(req.body);

    if (!siniestro.success) {
      return res.status(400).json(siniestro.error);
    }

    const result = await this.siniestroModel.update(id, siniestro.data);

    if (!result) {
      return res.status(500).json({ message: "Error al actualizar el siniestro" });
    }

    return res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const evidenciaExist = await this.evidenciaModel.getBySiniestro(id);

    if(evidenciaExist.length > 0) {
      return res.status(400).json({ success: false, error: "No se puede eliminar el siniestro porque tiene evidencias asociadas" });
    }
    const indemnizacionExist = await this.indemnizacionModel.getBySiniestro(id);

    if(indemnizacionExist.length > 0) {
      return res.status(400).json({ success: false, error: "No se puede eliminar el siniestro porque tiene indemnizaciones asociadas" });
    }

    const inspeccionSiniestroExist = await this.inspeccionSiniestroModel.getBySiniestro(id);

    if(inspeccionSiniestroExist.length > 0) {
      return res.status(400).json({ success: false, error: "No se puede eliminar el siniestro porque tiene inspecciones asociadas" });
    }

    const result = await this.siniestroModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el siniestro" });
    }

    return res.status(200).json({ success: true });
  }
}
import { validatePartialReporteSiniestro, validateReporteSiniestro } from "../schemas/reporteSiniestro.schema.js";

export default class ReporteSiniestroController {
  constructor({ reporteSiniestroModel, clienteModel, siniestroModel }) {
    this.reporteSiniestroModel = reporteSiniestroModel;
    this.clienteModel = clienteModel;
    this.siniestroModel = siniestroModel;
  }

  getAll = async (req, res) => {
    const reportes = await this.reporteSiniestroModel.getAll();

    res.json(reportes);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const reporte = await this.reporteSiniestroModel.getById(id);

    res.json(reporte);
  }

  getByCliente = async (req, res) => {
    const { documento } = req.params;

    const reportes = await this.reporteSiniestroModel.getByCliente(documento);

    res.json(reportes);
  }

  create = async (req, res) => {
    const newReporte = validateReporteSiniestro(req.body);

    if(!newReporte.success) {
      return res.status(400).json({ error: newReporte.error });
    }

    const clienteExist = await this.clienteModel.getById(newReporte.data.cliente_doc);

    if(clienteExist.length === 0) {
      return res.status(400).json({ error: "No existe el cliente" });
    }

    const result = await this.reporteSiniestroModel.create(newReporte.data);

    if (!result.success) {
      return res.status(400).json({error: "Error creating reporte"});
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const reporte = validatePartialReporteSiniestro(req.body);

    if(!reporte.success) {
      return res.status(400).json({ error: reporte.error });
    }

    const result = await this.reporteSiniestroModel.update(id, reporte.data);

    if (!result) {
      return res.status(400).json({error: "Error updating reporte"});
    }

    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const siniestroExist = await this.siniestroModel.getByReporteSiniestro(id);

    if(siniestroExist)
      return res.status(400).json({ success: false, error: "No se puede eliminar el reporte, ya que tiene un siniestro asociado" });

    const result = await this.reporteSiniestroModel.delete(id);

    if (!result) {
      return res.status(400).json({success: false, error: "Error deleting reporte"});
    }

    res.status(200).json({ success: true });
  }
  
}
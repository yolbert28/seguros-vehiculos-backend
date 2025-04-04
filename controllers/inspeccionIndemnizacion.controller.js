import { validateInspeccionIndemnizacion, validatePartialInspeccionIndemnizacion } from "../schemas/inspeccionIndemnizacion.schema";

export default class InspeccionIndemnizacionController {
  constructor({ inspeccionIndemnizacionModel, indemnizacionModel, empleadoModel }) {
    this.inspeccionIndemnizacionModel = inspeccionIndemnizacionModel;
    this.indemnizacionModel = indemnizacionModel;
    this.empleadoModel = empleadoModel;
  }

  getAll = async (req, res) => {
    const inspeccionesIndemnizacion = await this.inspeccionIndemnizacionModel.getAll();

    res.json(inspeccionesIndemnizacion);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const inspeccionIndemnizacion = await this.inspeccionIndemnizacionModel.getById(id);

    res.json(inspeccionIndemnizacion);
  }

  getByIndemnizacion = async (req, res) => {
    const { id } = req.params;
    const inspeccionesIndemnizacion = await this.inspeccionIndemnizacionModel.getByIndemnizacion(id);

    res.json(inspeccionesIndemnizacion);
  }

  getByInspectorDoc = async (req, res) => {
    const { doc } = req.params;
    const inspeccionesIndemnizacion = await this.inspeccionIndemnizacionModel.getByInspector(doc);

    res.json(inspeccionesIndemnizacion);
  }

  create = async (req, res) => {
    const newInspeccionIndemnizacion = validateInspeccionIndemnizacion(req.body);

    if (!newInspeccionIndemnizacion.success) {
      return res.status(400).json({ error: newInspeccionIndemnizacion.error });
    }

    const indemnizacionExist = await this.indemnizacionModel.getById(newInspeccionIndemnizacion.data.indemnizacion_id);

    if (!indemnizacionExist) {
      return res.status(400).json({ error: "Indemnizacion no existe" });
    }

    const empleadoExist = await this.empleadoModel.getById(newInspeccionIndemnizacion.data.inspector_doc);

    if (!empleadoExist) {
      return res.status(400).json({ error: "Empleado no existe" });
    }

    const result = await this.inspeccionIndemnizacionModel.create(newInspeccionIndemnizacion.data);

    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ error: "Error al crear inspeccion de indemnizacion" });
    }
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newInspeccionIndemnizacion = validatePartialInspeccionIndemnizacion(req.body);

    if (!newInspeccionIndemnizacion.success) {
      return res.status(400).json({ error: newInspeccionIndemnizacion.error });
    }

    const result = await this.inspeccionIndemnizacionModel.update(id, newInspeccionIndemnizacion.data);

    res.json(result);
  }

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.inspeccionIndemnizacionModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar la inspeccion" });
    }

    res.json({ success: true });
  }

}
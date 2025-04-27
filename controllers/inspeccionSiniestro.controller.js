import { validateInspeccionSiniestro, validatePartialInspeccionSiniestro } from "../schemas/inspeccionSiniestro.schema.js";

export default class InspeccionSiniestroController {
  constructor({ inspeccionSiniestroModel, siniestroModel, empleadoModel, repuestoSiniestroModel }) {
    this.inspeccionSiniestroModel = inspeccionSiniestroModel;
    this.siniestroModel = siniestroModel;
    this.empleadoModel = empleadoModel;
    this.repuestoSiniestroModel = repuestoSiniestroModel;
  }

  getAll = async (req, res) => {
    const inspeccionesSiniestro = await this.inspeccionSiniestroModel.getAll();

    res.json(inspeccionesSiniestro);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const inspeccionSiniestro = await this.inspeccionSiniestroModel.getById(id);

    if (inspeccionSiniestro) {
      const empleado = await this.empleadoModel.getById(inspeccionSiniestro.inspector_doc);
      const repuestosSiniestro = await this.repuestoSiniestroModel.getByInspeccion(inspeccionSiniestro.id);

      inspeccionSiniestro.inspector = empleado;
      inspeccionSiniestro.repuestos = repuestosSiniestro;
    }

    res.json(inspeccionSiniestro);
  }

  getBySiniestroId = async (req, res) => {
    const { id } = req.params;
    const inspeccionesSiniestro = await this.inspeccionSiniestroModel.getBySiniestro(id);

    res.json(inspeccionesSiniestro);
  }

  getByInspectorDoc = async (req, res) => {
    const { doc } = req.params;
    const inspeccionesSiniestro = await this.inspeccionSiniestroModel.getByInspector(doc);

    res.json(inspeccionesSiniestro);
  }

  create = async (req, res) => {
    const newInspeccionSiniestro = validateInspeccionSiniestro(req.body);

    if (!newInspeccionSiniestro.success) {
      return res.status(400).json({ error: newInspeccionSiniestro.error });
    }

    const siniestroExist = await this.siniestroModel.getById(newInspeccionSiniestro.data.siniestro_id);

    if (!siniestroExist) {
      return res.status(400).json({ error: "Siniestro no existe" });
    }

    const empleadoExist = await this.empleadoModel.getById(newInspeccionSiniestro.data.inspector_doc);

    if (!empleadoExist) {
      return res.status(400).json({ error: "Empleado no existe" });
    }

    const result = await this.inspeccionSiniestroModel.create(newInspeccionSiniestro.data);

    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ error: "Error al crear inspeccion siniestro" });
    }
  }

  update = async (req, res) => {
    const { id } = req.params;
    const updateInspeccionSiniestro = validatePartialInspeccionSiniestro(req.body);

    if (!updateInspeccionSiniestro.success) {
      return res.status(400).json({ error: updateInspeccionSiniestro.error });
    }

    const result = await this.inspeccionSiniestroModel.update(id, updateInspeccionSiniestro.data);

    if (result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Error al actualizar inspeccion siniestro" });
    }
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const repuestoSiniestroExist = await this.repuestoSiniestroModel.getByInspeccion(id)

    if (repuestoSiniestroExist.length > 0)
      return res.status(400).json({ success: false, error: "La inspeccion tiene repuestos asociados" })

    const result = await this.inspeccionSiniestroModel.delete(id);

    if (result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Error al eliminar inspeccion siniestro" });
    }
  }

}
import { validatePartialRepuestoSiniestro, validateRepuestoSiniestro } from "../schemas/repuestoSiniestro.schema.js";

export default class RepuestoSiniestroController {
  constructor({ repuestoSiniestroModel, inspeccionSiniestroModel }) {
    this.repuestoSiniestroModel = repuestoSiniestroModel;
    this.inspeccionSiniestroModel = inspeccionSiniestroModel;
  }

  getAll = async (req, res) => {
    const result = await this.repuestoSiniestroModel.getAll();

    return res.status(200).json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const result = await this.repuestoSiniestroModel.getById(id);

    if(result)
      res.status(200).json(result);
    else
      res.json({})
  }

  getByInspeccion = async (req, res) => {
    const { id } = req.params;
    const result = await this.repuestoSiniestroModel.getByInspeccion(id);

    return res.status(200).json(result);
  }

  create = async (req, res) => {
    const newRepuestoSiniestro = validateRepuestoSiniestro(req.body);

    if (!newRepuestoSiniestro.success) {
      return res.status(400).json({ error: newRepuestoSiniestro.error })
    }

    const inspeccionExist = await this.inspeccionSiniestroModel.getById(newRepuestoSiniestro.data.inspeccion_siniestro_id);

    if (!inspeccionExist) {
      return res.status(400).json({ error: "Inspeccion no existe" })
    }

    const nombreExits = await this.repuestoSiniestroModel.getByNombreAndInspeccion(newRepuestoSiniestro.data.nombre, newRepuestoSiniestro.data.inspeccion_siniestro_id);

    if (nombreExits.length > 0) {
      return res.status(400).json({ error: "Ya existe un repuesto con este nombre" })
    }

    const result = await this.repuestoSiniestroModel.create(newRepuestoSiniestro.data);

    if (!result.success) {
      return res.status(500).json({ error: "No se pudo crear el repuesto del siniestro" })
    }

    return res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newRepuestoSiniestro = validatePartialRepuestoSiniestro(req.body);

    if (!newRepuestoSiniestro.success) {
      return res.status(400).json({ error: newRepuestoSiniestro.error })
    }

    const repuestoSiniestroExist = await this.repuestoSiniestroModel.getById(id);

    if (!repuestoSiniestroExist) {
      return res.status(404).json({ success: false, error: "No existe un repuesto con este id" })
    }

    const nombreExits = await this.repuestoSiniestroModel.getByNombreAndInspeccion(newRepuestoSiniestro.data.nombre, repuestoSiniestroExist.inspeccion_siniestro_id);

    if (nombreExits.length > 0) {
      return res.status(400).json({ error: "Ya existe un repuesto con este nombre" })
    }

    const result = await this.repuestoSiniestroModel.update(id, newRepuestoSiniestro.data);

    if (!result) {
      return res.status(500).json({ error: "No se pudo crear el repuesto del siniestro" })
    }

    return res.status(200).json({ success: result });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const repuestoReparacionExist = await this.repuestoSiniestroModel.getById(id);

    if (!repuestoReparacionExist) {
      return res.status(404).json({ success: false, error: "No existe un repuesto con este id" })
    }

    const result = await this.repuestoSiniestroModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "No se pudo eliminar el repuesto del siniestro" })
    }

    return res.status(200).json({ success: true });
  }
}
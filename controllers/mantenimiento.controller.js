import { validateMantenimiento, validatePartialMantenimiento } from "../schemas/mantenimiento.schema.js";

export default class MantenimientoController {
  constructor({ mantenimientoModel, vehiculoModel, tallerModel }) {
    this.mantenimientoModel = mantenimientoModel;
    this.vehiculoModel = vehiculoModel;
    this.tallerModel = tallerModel;
  }

  getAll = async (req, res) => {
    const mantenimientos = await this.mantenimientoModel.getAll();

    res.json(mantenimientos);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const mantenimiento = await this.mantenimientoModel.getById(id);

    if (mantenimiento) {
      const taller = await this.tallerModel.getById(mantenimiento.taller_rif);

      mantenimiento.taller = taller;
    }

    res.json(mantenimiento);
  }

  getByVehiculo = async (req, res) => {
    const { matricula } = req.params;

    const mantenimientos = await this.mantenimientoModel.getByVehiculo(matricula);

    res.json(mantenimientos);
  }

  getByTaller = async (req, res) => {
    const { rif } = req.params;

    const mantenimientos = await this.mantenimientoModel.getByTaller(rif);

    res.json(mantenimientos);
  }

  create = async (req, res) => {
    const newMantenimiento = validateMantenimiento(req.body);

    if (!newMantenimiento.success) {
      return res.status(400).json(newMantenimiento.error);
    }

    const vehiculoExist = await this.vehiculoModel.getById(newMantenimiento.data.vehiculo_mat);

    if (!vehiculoExist) {
      return res.status(400).json({ message: "Vehículo no encontrado" });
    }

    const tallerExist = await this.tallerModel.getById(newMantenimiento.data.taller_rif);

    if (!tallerExist) {
      return res.status(400).json({ message: "Taller no encontrado" });
    }

    const result = await this.mantenimientoModel.create(newMantenimiento.data);

    if (!result.success) {
      return res.status(500).json({ message: "Error al crear el mantenimiento" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;

    const mantenimiento = validatePartialMantenimiento(req.body);

    if (!mantenimiento.success) {
      return res.status(400).json(mantenimiento.error);
    }

    const result = await this.mantenimientoModel.update(id, mantenimiento.data);

    if (!result) {
      return res.status(500).json({ message: "Error al actualizar el mantenimiento" });
    }

    res.json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const mantenimientoExist = await this.mantenimientoModel.getById(id)

    if (!mantenimientoExist) {
      return res.status(404).json({ success: false, error: "No existe un mantenimiento con este id" })
    }

    const result = await this.mantenimientoModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, message: "Error al eliminar el mantenimiento" });
    }

    res.json({ success: true });
  }
}
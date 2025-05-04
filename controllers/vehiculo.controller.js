import { validatePartialVehiculo, validateVehiculo } from "../schemas/vehiculo.schema.js";

export default class VehiculoController {
  constructor({ vehiculoModel, polizaModel, siniestroModel, mantenimientoModel, modeloModel }) {
    this.vehiculoModel = vehiculoModel;
    this.polizaModel = polizaModel;
    this.siniestroModel = siniestroModel;
    this.mantenimientoModel = mantenimientoModel;
    this.modeloModel = modeloModel;
  }

  getAll = async (req, res) => {
    const vehiculos = await this.vehiculoModel.getAll();

    res.json(vehiculos);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const vehiculo = await this.vehiculoModel.getById(id);

    if (vehiculo) {
      const modelo = await this.modeloModel.getById(vehiculo.modelo_id);
      const poliza = await this.polizaModel.getById(vehiculo.poliza_id);
      const mantenimientos = await this.mantenimientoModel.getByVehiculo(id);
      const siniestros = await this.siniestroModel.getByVehiculo(id);

      vehiculo.modelo = modelo;
      vehiculo.poliza = poliza;
      vehiculo.mantenimientos = mantenimientos;
      vehiculo.siniestros = siniestros;
    }

    res.json(vehiculo);
  }

  getByPoliza = async (req, res) => {
    const { id } = req.params;

    const vehiculos = await this.vehiculoModel.getByPoliza(id);

    res.json(vehiculos);
  }

  getByCliente = async (req, res) => {
    const { id } = req.params;

    const vehiculos = await this.vehiculoModel.getByCliente(id);

    res.json(vehiculos);
  }


  create = async (req, res) => {
    const newVehiculo = validateVehiculo(req.body);

    if (!newVehiculo.success) {
      return res.status(400).json({ error: newVehiculo.error });
    }

    const vehiculoExist = await this.vehiculoModel.getById(newVehiculo.data.matricula);

    if (vehiculoExist) {
      return res.status(400).json({ error: "Ya existe un vehiculo con esa matricula" });
    }

    const polizaExist = await this.polizaModel.getById(newVehiculo.data.poliza_id);

    if (!polizaExist) {
      return res.status(400).json({ error: "No existe la poliza" });
    }

    const result = await this.vehiculoModel.create(newVehiculo.data);

    if (!result.success) {
      return res.status(400).json({ error: "Error creating vehiculo" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const vehiculo = validatePartialVehiculo(req.body);
  
    if (!vehiculo.success) {
      return res.status(400).json({ error: vehiculo.error });
    }
  
    const vehiculoExist = await this.vehiculoModel.getById(id);
  
    if (!vehiculoExist) {  // Cambiado de vehiculoExist.length === 0
      return res.status(400).json({ error: "No existe el vehiculo" });
    }
  
    const result = await this.vehiculoModel.update(id, vehiculo.data);
  
    if (!result) {
      return res.status(400).json({ error: "Error updating vehiculo" });
    }
  
    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const siniestroExist = await this.siniestroModel.getByVehiculo(id);

    if (siniestroExist.length > 0) {
      return res.status(400).json({ success: false, error: "El vehiculo tiene siniestros registrados" })
    }

    const mantenimientoExist = await this.mantenimientoModel.getByVehiculo(id);

    if (mantenimientoExist.length > 0) {
      return res.status(400).json({ success: false, error: "El vehiculo tiene mantenimientos registrados" })
    }

    const result = await this.vehiculoModel.delete(id);

    if (!result) {
      return res.status(400).json({ success: false, error: "Error deleting vehiculo" });
    }

    res.status(200).json({ success: true });
  }
}
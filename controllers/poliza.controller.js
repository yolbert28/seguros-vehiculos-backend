import { validatePoliza } from "../schemas/poliza.schema.js";

export default class PolizaController {
  constructor({ polizaModel, empleadoModel, polizaServicioModel, vehiculoModel, primaModel }) {
    this.polizaModel = polizaModel;
    this.empleadoModel = empleadoModel;
    this.polizaServicioModel = polizaServicioModel;
    this.vehiculoModel = vehiculoModel;
    this.primaModel = primaModel;
  }

  getAll = async (req, res) => {
    const result = await this.polizaModel.getAll();

    return res.json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.polizaModel.getById(id);

    return res.json(result);
  }

  getByCliente = async (req, res) => {
    const { document } = req.params;
    
    const result = await this.polizaModel.getByCliente(document);

    return res.json(result);
  }

  create = async (req, res) => {
    const newPoliza = validatePoliza(req.body);

    if (!newPoliza.success) {
      return res.status(400).json({ error: newPoliza.error });
    }

    const empleadoExist = await this.empleadoModel.getById(newPoliza.data.asesor_doc);

    if (!empleadoExist) {
      return res.status(400).json({ error: "El empleado no existe" });
    }

    if (empleadoExist.tipo_empleado_id !== 2) {
      return res.status(400).json({ error: "El empleado no es un asesor" });
    }

    const result = await this.polizaModel.create(newPoliza.data);

    if (!result.success) {
      return res.status(500).json({ error: "Error al crear poliza" });
    }

    return res.status(200).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const updatePoliza = validatePoliza(req.body);

    if (!updatePoliza.success) {
      return res.status(400).json({ error: updatePoliza.error });
    }

    const empleadoExist = await this.empleadoModel.getById(updatePoliza.data.asesor_doc);

    if (!empleadoExist) {
      return res.status(400).json({ error: "El empleado no existe" });
    }

    if (empleadoExist.tipo_empleado_id !== 2) {
      return res.status(400).json({ error: "El empleado no es un asesor" });
    }

    const result = await this.polizaModel.update(id, updatePoliza.data);

    if (!result) {
      return res.status(500).json({ error: "Error al actualizar poliza" });
    }

    return res.status(200).json({ success: true });
  }

  addServicio = async (req, res) => {
    const { id, servicioId } = req.params

    const polizaServicioExist = await this.polizaServicioModel.getById(id, servicioId);

    if (polizaServicioExist.length > 0) {
      return res.status(400).json({ success: false, error: "La poliza ya contiene este servicio" })
    }

    const result = await this.polizaServicioModel.create({ poliza_id: id, servicio_id: servicioId })

    if (!result)
      return res.status(500).json({ success: false, error: "Error al agregar el servicio a la poliza" })

    res.status(200).json({ success: true })
  }

  removeServicio = async (req, res) => {
    const { id, servicioId } = req.params

    const polizaServicioExist = await this.polizaServicioModel.getById(id, servicioId);

    if (!polizaServicioExist) {
      return res.status(400).json({ success: true, error: "El servicio no se encuentra dentro de la poliza" })
    }

    const result = await this.polizaServicioModel.delete({ poliza_id: id, servicio_id: servicioId })

    if (result)
      return res.status(500).json({ success: true, error: "Error al remover el servicio de la poliza" })

    res.status(200).json({ success: true })
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const vehiculoExist = await this.vehiculoModel.getByPoliza(id);

    if (vehiculoExist.length > 0)
      return res.status(400).json({ success: false, error: "La poliza tiene vehiculos a su cargo" })

    const primaExist = await this.primaModel.getByPoliza(id);

    if (primaExist.length > 0)
      return res.status(400).json({ success: false, error: "La poliza tiene primas registradas" })

    const result = await this.polizaModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar la poliza" });
    }

    return res.status(200).json({ success: result });
  }
}
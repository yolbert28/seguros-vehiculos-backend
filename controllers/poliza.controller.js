import { validatePoliza } from "../schemas/poliza.schema.js";

export default class PolizaController {
  constructor({ polizaModel, empleadoModel, coberturaPolizaModel, coberturaModel, vehiculoModel, primaModel }) {
    this.polizaModel = polizaModel;
    this.empleadoModel = empleadoModel;
    this.coberturaPolizaModel = coberturaPolizaModel;
    this.coberturaModel = coberturaModel;
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


    if (result) {
      const resultVehiculo = await this.vehiculoModel.getByPoliza(id);
      const resultPrima = await this.primaModel.getByPoliza(id);
      const coberturas = await this.coberturaModel.getCoberturasByPoliza(id);
      const empleado = await this.empleadoModel.getById(result.asesor_doc);
      result.vehiculos = resultVehiculo;
      result.primas = resultPrima;
      result.asesor = empleado;
      result.coberturas = coberturas;
    }

    return res.json({ success: true, data: result });
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

  addCobertura = async (req, res) => {
    const { id, coberturaId } = req.params

    const coberturaPolizaExist = await this.coberturaPolizaModel.getById(coberturaId, id);

    if (coberturaPolizaExist) {
      return res.status(400).json({ success: false, error: "La poliza ya contiene esta cobertura" })
    }

    const result = await this.coberturaPolizaModel.create({ poliza_id: id, cobertura_id: coberturaId })

    if (!result)
      return res.status(500).json({ success: false, error: "Error al agregar la cobertura a la poliza" })

    res.status(200).json({ success: true })
  }

  removeCobertura = async (req, res) => {
    const { id, coberturaId } = req.params

    const coberturaPolizaExist = await this.coberturaPolizaModel.getById(coberturaId, id);

    if (!coberturaPolizaExist) {
      return res.status(400).json({ success: false, error: "La cobertura no se encuentra dentro de la poliza" })
    }

    const result = await this.coberturaPolizaModel.delete({ poliza_id: id, cobertura_id: coberturaId })

    if (!result)
      return res.status(500).json({ success: false, error: "Error al remover la cobertura de la poliza" })

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

    const hasCobertura = await this.coberturaPolizaModel.getByPoliza(id);

    if (hasCobertura.length > 0) {
      return res.status(400).json({ success: false, error: "La poliza tiene coberturas asignadas" })
    }

    const result = await this.polizaModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar la poliza" });
    }

    return res.status(200).json({ success: result });
  }
}
import { validateServicio } from "../schemas/servicio.schema.js";

export default class ServicioController {
  constructor({ servicioModel, coberturaServicioModel, polizaServicioModel }) {
    this.servicioModel = servicioModel;
    this.coberturaServicioModel = coberturaServicioModel;
    this.polizaServicioModel = polizaServicioModel;
  }

  getAll = async (req, res) => {
    const result = await this.servicioModel.getAll();

    res.json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.servicioModel.getById(id);

    res.json(result);
  }

  create = async (req, res) => {
    const newServicio = validateServicio(req.body);

    if (!newServicio.success) {
      return res.status(400).json({
        success: false, error: newServicio.error
      });
    }

    const nombreExist = await this.servicioModel.getByNombre(newServicio.data.nombre);

    if (nombreExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Nombre ya registrado"
      });
    }

    const result = await this.servicioModel.create({ input: newServicio.data });

    if (!result.success) {
      return res.status(400).json({
        success: false, error: "Error al crear servicio"
      });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newServicio = validateServicio(req.body);

    if (!newServicio.success) {
      return res.status(400).json({
        success: false, error: newServicio.error
      });
    }

    const nombreExist = await this.servicioModel.getByNombreAndNotId(newServicio.data.nombre, id);

    if (nombreExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Nombre ya registrado"
      });
    }

    const result = await this.servicioModel.update({ id, input: newServicio.data });

    if (!result) {
      return res.status(400).json({
        success: false, error: "Error al actualizar servicio"
      });
    }

    res.json({ success: true });
  }

  addCobertura = async (req, res) => {
    const { id, coberturaId } = req.params

    const coberturaServicioExist = await this.coberturaServicioModel.getById(id, coberturaId);

    if (coberturaServicioExist) {
      return res.status(400).json({ success: false, error: "La cobertura ya se encuentra registrada en el servicio" })
    }

    const result = await this.coberturaServicioModel.create({ cobertura_id: coberturaId, servicio_id: id })

    if (result)
      return res.status(500).json({ success: false, error: "No se pudo agregar la cobertura al servicio" })

    res.status(200).json({ success: true })
  }

  removeCobertura = async (req, res) => {
    const { id, coberturaId } = req.params

    const coberturaServicioExist = await this.coberturaServicioModel.getById(id, coberturaId);

    if (!coberturaServicioExist) {
      return res.status(400).json({ success: false, error: "Esta cobertura no se encuentra registrada al servicio" })
    }

    const result = await this.coberturaServicioModel.delete({ cobertura_id: coberturaId, servicio_id: id })

    if (result)
      return res.status(500).json({ success: false, error: "No se pudo remover la cobertura del servicio" })

    res.status(200).json({ success: true })
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const hasCoberturaServicio = await this.coberturaServicioModel.getByCobertura(id)

    if (hasCoberturaServicio) {
      return res.status(400).json({ success: false, error: "No se puede eliminar porque tiene coberturas agregadas" })
    }

    const hasPolizaServicio = await this.polizaServicioModel.getByServicio(id);

    if (hasPolizaServicio) {
      return res.status(400).json({ success: false, error: "No se puede eliminar porque se encuentra siendo utilizado por algunas polizas" })
    }

    const result = await this.servicioModel.delete(id);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el servicio" });
    }

    res.json({ success: true });
  }
}
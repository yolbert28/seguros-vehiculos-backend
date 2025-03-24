import { validateServicio } from "../schemas/servicio.schema.js"; 

export default class ServicioController {
  constructor({ servicioModel }) {
    this.servicioModel = servicioModel;
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

    if(!result.success) {
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

    if(!result) {
      return res.status(400).json({
        success: false, error: "Error al actualizar servicio"
      });
    }

    res.json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const result = await this.servicioModel.delete(id);

    if(!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el servicio" });
    }

    res.json({ success: true });
  }
}
import { validateCobertura, validatePartialCobertura } from "../schemas/cobertura.schema.js";

export default class CoberturaController {
  constructor({ coberturaModel, coberturaPolizaModel }) {
    this.coberturaModel = coberturaModel;
    this.coberturaPolizaModel = coberturaPolizaModel;
  }

  getAll = async (req, res) => {
    const result = await this.coberturaModel.getAll();

    res.json(result);
  }

  getById = async (req, res) => {
    const { id } = req.params;

    const result = await this.coberturaModel.getById(id);

    
    if(result)
      res.json(result);
    else
      res.json({})
  }


  getCoberturasByPoliza = async (req, res) => {
    const { polizaId } = req.params;

    const result = await this.coberturaModel.getCoberturasByPoliza(polizaId);

    res.json(result);
  }

  create = async (req, res) => {
    const newCobertura = validateCobertura(req.body);

    if (!newCobertura.success) {
      return res.status(400).json({
        success: false, error: newCobertura.error
      });
    }

    const nombreExist = await this.coberturaModel.getByNombre(newCobertura.data.nombre);

    if (nombreExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Nombre ya registrado"
      });
    }

    const result = await this.coberturaModel.create({ input: newCobertura.data });

    if (!result.success) {
      return res.status(400).json({
        success: false, error: "Error al crear cobertura"
      });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newCobertura = validatePartialCobertura(req.body);

    if (!newCobertura.success) {
      return res.status(400).json({
        success: false, error: newCobertura.error
      });
    }

    const nombreExist = await this.coberturaModel.getByNombreAndNotId(newCobertura.data.nombre, id);

    if (nombreExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Nombre ya registrado"
      });
    }

    const result = await this.coberturaModel.update({ id, input: newCobertura.data });

    if (!result) {
      return res.status(400).json({
        success: false, error: "Error al actualizar cobertura"
      });
    }

    res.json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const hasCoberturaPoliza = await this.coberturaPolizaModel.getByCobertura(id)

    if (hasCoberturaPoliza.length > 0) {
      return res.status(400).json({ success: false, error: "No se puede eliminar porque se encuentra siendo utilizado por algunas coberturas" })
    }

    const result = await this.coberturaModel.delete(id);

    if (!result) {
      return res.status(400).json({
        success: false, error: "Error al eliminar cobertura"
      });
    }

    res.json({ success: true });
  }
}
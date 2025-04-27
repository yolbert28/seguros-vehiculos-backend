import { validateModelo } from "../schemas/modelo.schema.js";

export default class ModeloController {
  constructor({ modeloModel, marcaModel, vehiculoModel }) {
    this.modeloModel = modeloModel;
    this.marcaModel = marcaModel;
    this.vehiculoModel = vehiculoModel;
  }

  getAll = async (req, res) => {
    const modelos = await this.modeloModel.getAll();

    res.json(modelos);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const modelo = await this.modeloModel.getById(id);

    res.json(modelo);
  }

  getByMarca = async (req, res) => {
    const { id } = req.params;

    const modelo = await this.modeloModel.getByMarca(id);

    res.json(modelo);
  }

  create = async (req, res) => {
    const newModelo = validateModelo(req.body);

    if (!newModelo.success) {
      return res.status(400).json({ error: newModelo.error });
    }

    const modeloExits = await this.modeloModel.getByNombreAndNotMarcaId(newModelo.data.nombre, newModelo.data.marca_id);

    if (modeloExits.length > 0) {
      return res.status(400).json({ error: "El modelo ya existe" });
    }

    const marca = await this.marcaModel.getById(newModelo.data.marca_id);

    if (marca.length === 0) {
      return res.status(400).json({ error: "La marca no existe" });
    }

    const result = await this.modeloModel.create({ input: newModelo.data });

    if (!result.success) {
      return res.status(400).json({ error: "Error creating modelo" });
    }

    res.status(200).json(result.data);
  }

  update = async (req, res) => {
    const { id } = req.params;
    const newModelo = validateModelo(req.body);

    if (!newModelo.success) {
      return res.status(400).json({ error: newModelo.error });
    }

    const modeloExits = await this.modeloModel.getByNombreAndNotId(newModelo.data.nombre, id);

    const modeloMarcaExits = await this.modeloModel.getByNombreAndNotMarcaId(newModelo.data.nombre, newModelo.data.marca_id);

    if (modeloExits.length > 0 && modeloMarcaExits.length > 0) {
      return res.status(400).json({ error: "Ya existe un modelo con este nombre" });
    }

    const result = await this.modeloModel.update({ id, input: newModelo.data });

    if (!result) {
      return res.status(400).json({ error: "Error updating modelo" });
    }

    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const vehiculoExist = await this.vehiculoModel.getByModelo(id);

    if (vehiculoExist.length > 0) {
      return res.status(400).json({ success: false, error: "Existen vehiculos con este modelo registrado" })
    }

    const result = await this.modeloModel.delete(id);

    if (!result) {
      return res.status(400).json({ success: false, error: "Error al eliminar el modelo" });
    }

    res.json({ success: true });
  }
}
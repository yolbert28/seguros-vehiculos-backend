import { validateMarca } from "../schemas/marca.schema.js";

export default class MarcaController {
  constructor({ marcaModel }) {
    this.marcaModel = marcaModel;
  }

  getAll = async (req, res) => {
    const marcas = await this.marcaModel.getAll();

    res.status(200).json(marcas);
  };

  getById = async (req, res) => {
    const { id } = req.params;

    const marca = await this.marcaModel.getById(id);

    res.status(200).json(marca);
  };

  create = async (req, res) => {
    const newMarca = validateMarca(req.body);

    if (!newMarca.success) {
      return res.status(400).json({ error: newMarca.error });
    }

    const nombreExist = await this.marcaModel.getByNombre(newMarca.data.nombre);

    if (nombreExist.length > 0) {
      return res.status(400).json({ error: "Nombre ya registrado" });
    }

    const result = await this.marcaModel.create({ input: newMarca.data});

    if(!result.success) {
      return res.status(400).json({ error: "Error al crear marca" });
    }

    res.status(201).json(result.data);
  };

  update = async (req, res) => {
    const { id } = req.params;
    const newMarca = validateMarca(req.body);

    if (!newMarca.success) {
      return res.status(400).json({ error: newMarca.error });
    }

    const nombreExits = await this.marcaModel.getByNombreAndNotId({ nombre: newMarca.data.nombre, id});

    if(nombreExits.length > 0) {
      return res.status(400).json({ error: "Nombre ya registrado" });
    }

    const result = await this.marcaModel.update({ id, input: newMarca.data });

    if(!result) {
      return res.status(400).json({ error: "Error al actualizar marca" });
    }

    res.status(200).json({success: result});
  };

  delete = async (req, res) => {
    const { id } = req.params;

    const marcaExist = await this.marcaModel.getById(id);

    if (marcaExist.length === 0) {
      return res.status(400).json({ error: "No existe una marca con el id: " + id });
    }

    const result = await this.marcaModel.delete(id);

    if(!result) {
      return res.status(400).json({ error: "Error al eliminar marca" });
    }

    res.status(200).json(result);
  };
}
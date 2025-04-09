import { validatePartialTaller, validateTaller } from "../schemas/taller.schema.js";

export default class TallerController {
  constructor({ tallerModel, reparacionModel, mantenimientoModel }) {
    this.tallerModel = tallerModel;
    this.reparacionModel = reparacionModel;
    this.mantenimientoModel = mantenimientoModel;
  }

  getAll = async (req, res) => {
    const talleres = await this.tallerModel.getAll();

    res.status(200).json(talleres);
  }

  getById = async (req, res) => {
    const { rif } = req.params;
    const taller = await this.tallerModel.getById(rif);

    res.json(taller);
  }

  getByName = async (req, res) => {
    const { name } = req.params;
    const taller = await this.tallerModel.getByName(name);

    res.json(taller);
  }

  create = async (req, res) => {
    const newTaller = validateTaller(req.body);

    if (!newTaller.success) {
      return res.status(400).json({ error: newTaller.error });
    }

    const rifExist = await this.tallerModel.getById(newTaller.data.rif);

    if (rifExist) {
      return res.status(400).json({ message: "Ya existe un taller con ese rif" });
    }

    const nameExist = await this.tallerModel.getByName(newTaller.data.nombre);

    if (nameExist.length > 0) {
      return res.status(400).json({ message: "Ya existe un taller con ese nombre" });
    }

    const correoExist = await this.tallerModel.getByCorreo(newTaller.data.correo);

    if (correoExist.length > 0) {
      return res.status(400).json({ message: "Ya existe un taller con ese correo" });
    }

    console.log(newTaller.data);
    const result = await this.tallerModel.create(newTaller.data);

    if (result.success) {
      res.status(201).json(result.data);
    } else {
      res.status(500).json({ message: "Error al crear el taller" });
    }
  }

  update = async (req, res) => {
    const { rif } = req.params;
    const newTaller = validatePartialTaller(req.body);

    if (!newTaller.success) {
      return res.status(400).json({ error: newTaller.error });
    }

    const nameExist = await this.tallerModel.getByNameAndNotRif(newTaller.data.nombre, rif);

    if (nameExist.length > 0) {
      return res.status(400).json({ message: "Ya existe un taller con ese nombre" });
    }

    const correoExist = await this.tallerModel.getByCorreoAndNotRif(newTaller.data.correo, rif);

    if (correoExist.length > 0) {
      return res.status(400).json({ message: "Ya existe un taller con ese correo" });
    }

    const result = await this.tallerModel.update(rif, newTaller.data);

    if (result) {
      res.status(200).json({ message: "Taller actualizado" });
    } else {
      res.status(500).json({ message: "Error al actualizar el taller" });
    }
  }

  delete = async (req, res) => {
    const { rif } = req.params;

    const reparacionExist = await this.reparacionModel.getByTaller(rif);

    if (reparacionExist.length > 0)
      return res.status(400).json({ success: false, error: "El taller tiene reparaciones registradas" })

    const mantenimientoExist = await this.mantenimientoModel.getByTaller(rif)

    if (mantenimientoExist.length > 0)
      return res.status(400).json({ success: false, error: "El taller tiene mantenimientos registrados" })

    const result = await this.tallerModel.delete(rif);

    if (result) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Error al eliminar el taller" });
    }
  }
}
import { validateEmpleado, validatePartialEmpleado } from "../schemas/empleado.schema.js";
import bcrypt from "bcryptjs";

export default class EmpleadoController {
  constructor({ empleadoModel }) {
    this.empleadoModel = empleadoModel;
  }

  getAll = async (req, res) => {
    const result = await this.empleadoModel.getAll();

    return res.json(result);
  }

  getById = async (req, res) => {
    const { documento } = req.params;

    const result = await this.empleadoModel.getById(documento);

    return res.json(result);
  }

  create = async (req, res) => {
    const newEmpleado = validateEmpleado(req.body);

    if (!newEmpleado.success) {
      return res.status(400).json({ error: newEmpleado.error });
    }

    const documentoExists = await this.empleadoModel.getById(newEmpleado.data.documento);

    if (documentoExists) {
      return res.status(400).json({ error: "Documento ya existe" });
    }

    const correoExists = await this.empleadoModel.getByCorreo(newEmpleado.data.correo);

    if (correoExists) {
      return res.status(400).json({ error: "Correo ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    newEmpleado.data.contrasena = await bcrypt.hash(newEmpleado.data.contrasena, salt);

    const result = await this.empleadoModel.create(newEmpleado.data);

    if (!result.success) {
      return res.status(500).json({ error: "Error al crear empleado" });
    }

    return res.status(200).json(result.data);
  }

  update = async (req, res) => {
    const { documento } = req.params;
    const updateEmpleado = validatePartialEmpleado(req.body);

    if (!updateEmpleado.success) {
      return res.status(400).json({ error: updateEmpleado.error });
    }

    const documentoExists = await this.empleadoModel.getById(documento);

    if (!documentoExists) {
      return res.status(400).json({ error: "Documento no existe" });
    }

    const correoExists = await this.empleadoModel.getByCorreoAndNotDocumento(updateEmpleado.data.correo, documento);

    if (correoExists) {
      return res.status(400).json({ error: "Correo ya existe" });
    }

    const result = await this.empleadoModel.update(documento, updateEmpleado.data);

    if (!result) {
      return res.status(500).json({ error: "Error al actualizar empleado" });
    }

    return res.status(200).json({success: true});
  }

  delete = async (req, res) => {
    const { documento } = req.params;

    const documentoExists = await this.empleadoModel.getById(documento);

    if (!documentoExists) {
      return res.status(400).json({ error: "Documento no existe" });
    }

    const result = await this.empleadoModel.delete(documento);

    return res.status(200).json({ sucess: result });
  }

  changePassword = async (req, res) => {
    const { documento } = req.params;
    const { contrasena } = req.body;

    const documentoExists = await this.empleadoModel.getById(documento);

    if (!documentoExists) {
      return res.status(400).json({ error: "Documento no existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const result = await this.empleadoModel.changePassword(documento, hashedPassword);

    if (!result) {
      return res.status(500).json({ error: "Error al cambiar contraseña"});
    }

    return res.status(200).json({ sucess: result });
  }
}
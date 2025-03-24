import { validateCliente, validatePartialCliente } from "../schemas/cliente.schema.js";
import bcrypt from "bcryptjs";

export default class ClienteController {
  constructor({ clienteModel }) {
    this.clienteModel = clienteModel;
  }

  getAll = async (req, res) => {
    console.log(this.clienteModel);
    const result = await this.clienteModel.getAll();

    res.json(result);
  }

  getById = async (req, res) => {
    const { documento } = req.params;

    const result = await this.clienteModel.getById(documento);

    res.json(result);
  }

  getByEmail = async (req, res) => {
    const { correo } = req.params;

    const result = await this.clienteModel.getByEmail(correo);

    res.json(result);
  }

  create = async (req, res) => {
    const newCliente = validateCliente(req.body);

    if (!newCliente.success) {
      return res.status(400).json({
        success: false, error: newCliente.error
      });
    }

    const documentoExist = await this.clienteModel.getById(newCliente.data.documento);

    if (documentoExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Documento ya registrado"
      });
    }

    const emailExist = await this.clienteModel.getByEmail(newCliente.data.correo);

    if (emailExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Correo ya registrado"
      });
    }

    const salt = await bcrypt.genSalt(10);
    newCliente.data.contrasena = await bcrypt.hash(newCliente.data.contrasena, salt);

    const result = await this.clienteModel.create({ input: newCliente.data });

    if(!result.success) {
      return res.status(500).json({ success: false, error: "Error al crear el cliente" });
    }

    res.status(201).json(result.data);
  }

  update = async (req, res) => {
    const { documento } = req.params;
    const newCliente = validatePartialCliente(req.body);

    if (!newCliente.success) {
      return res.status(400).json({
        success: false, error: newCliente.error
      });
    }

    const documentoExist = await this.clienteModel.getById(documento);

    if (documentoExist.length === 0) {
      return res.status(400).json({
        success: false, error: "Documento no registrado"
      });
    }

    const emailExist = await this.clienteModel.getByEmailAndNotId(newCliente.data.correo, documento);

    if (emailExist.length > 0 ) {
      return res.status(400).json({
        success: false, error: "Correo ya registrado"
      });
    }

    const result = await this.clienteModel.update({ documento, input: newCliente.data });

    if(!result) {
      return res.status(500).json({ success: false, error: "Error al actualizar el cliente" });
    }

    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { documento } = req.params;

    const result = await this.clienteModel.delete(documento);

    if(!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el cliente" });
    }

    res.json({ success: true });
  }

  changePassword = async (req, res) => {
    const { documento } = req.params;
    const newContrasena = validatePartialCliente(req.body);

    if (!newContrasena.success) {
      return res.status(400).json({
        success: false, error: newContrasena.error
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newContrasena.data.contrasena, salt);

    const result = await this.clienteModel.changePassword({ documento, contrasena: hashedPassword });

    if(!result) {
      return res.status(500).json({ success: false, error: "Error al cambiar la contraseña" });
    }

    res.json({ success: true });
  }
}
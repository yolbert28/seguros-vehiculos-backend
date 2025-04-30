import { validateCliente, validatePartialCliente } from "../schemas/cliente.schema.js";
import bcrypt from "bcryptjs";
import { validateCredenciales } from "../schemas/credenciales.schema.js";
import jwt from "jsonwebtoken";

export default class ClienteController {
  constructor({ clienteModel, polizaModel, reporteSiniestroModel }) {
    this.clienteModel = clienteModel;
    this.polizaModel = polizaModel;
    this.reporteSiniestroModel = reporteSiniestroModel;
  }

  getAll = async (req, res) => {
    console.log(this.clienteModel);
    const result = await this.clienteModel.getAll();

    res.json(result);
  }

  getById = async (req, res) => {
    const { documento } = req.params;

    const result = await this.clienteModel.getById(documento);

    const resultPolizas = await this.polizaModel.getByCliente(documento);

    const reporteSiniestro = await this.reporteSiniestroModel.getByCliente(documento);

    if (result){
      result.polizas = resultPolizas;
      result.reporteSiniestro = reporteSiniestro;
    }

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

    if (documentoExist) {
      return res.status(400).json({
        success: false, error: "Documento ya registrado"
      });
    }

    const emailExist = await this.clienteModel.getByEmail(newCliente.data.correo);

    if (emailExist) {
      return res.status(400).json({
        success: false, error: "Correo ya registrado"
      });
    }

    const salt = await bcrypt.genSalt(10);
    newCliente.data.contrasena = await bcrypt.hash(newCliente.data.contrasena, salt);

    const result = await this.clienteModel.create({ input: newCliente.data });

    if (!result.success) {
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

    if (!documentoExist) {
      return res.status(400).json({
        success: false, error: "Documento no registrado"
      });
    }

    const emailExist = await this.clienteModel.getByEmailAndNotId(newCliente.data.correo, documento);

    if (emailExist.length > 0) {
      return res.status(400).json({
        success: false, error: "Correo ya registrado"
      });
    }

    const result = await this.clienteModel.update({ documento, input: newCliente.data });

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al actualizar el cliente" });
    }

    res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { documento } = req.params;

    const polizaExist = await this.polizaModel.getByCliente(documento);

    if (polizaExist.length > 0) {
      return res.status(400).json({ success: false, error: "El cliente tiene polizas a su nombre" })
    }

    const reporteSiniestroExist = await this.reporteSiniestroModel.getByCliente(documento)

    if (reporteSiniestroExist.length > 0) {
      return res.status(400).json({ success: true, error: "El cliente tiene reportes registrados" })
    }

    const result = await this.clienteModel.delete(documento);

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al eliminar el cliente" });
    }

    res.json({ success: true });
  }

  login = async (req, res) => {
    const credentials = validateCredenciales(req.body);

    if (!credentials.success) {
      return res.status(400).json({ success: false, error: credentials.error });
    }

    const { documento, contrasena } = credentials.data;

    const user = await this.clienteModel.getContrasena(documento);

    if (!user) {
      return res.status(400).json({ success: false, error: "Credenciales invalidas" });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Credenciales invalidas" });
    }

    const token = jwt.sign({ documento: documento }, "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAAeyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDIwNDY2NzcsImlkIjoiM2I5YjUwMzUtMzFhZC00ZDdmLTg5MDAtOWVmMDZlYTgxNzMxIn0.kE72PyjobCFI1QL6BewEyyQ__yRtWRllCPlAbuNMDgr6pzwMcPrMKPhzk82eQgaDk1BO3p-jRCb8uIxh9WMtAA", { expiresIn: 14400 });

    return res.status(200).json({ token, user:{
      documento: user.documento, nombre: user.nombre, correo: user.correo, telefono: user.telefono, direccion: user.direccion
    } });
  }

  changePassword = async (req, res) => {
    const { documento } = req.params;
    const newContrasena = validatePartialCliente(req.body);

    if (!newContrasena.success) {
      return res.status(400).json({
        success: false, error: newContrasena.error
      });
    }

    if (!newContrasena.data.contrasena) {
      return res.status(400).json({
        success: false, error: "Contraseña no valida"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newContrasena.data.contrasena, salt);

    const result = await this.clienteModel.changePassword({ documento, contrasena: hashedPassword });

    if (!result) {
      return res.status(500).json({ success: false, error: "Error al cambiar la contraseña" });
    }

    res.json({ success: true });
  }
}
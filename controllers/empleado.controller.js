import { validateCredenciales } from "../schemas/credenciales.schema.js";
import { validateEmpleado, validatePartialEmpleado } from "../schemas/empleado.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class EmpleadoController {
  constructor({ empleadoModel, inspeccionSiniestroModel, inspeccionIndemnizacionModel, polizaModel  }) {
    this.empleadoModel = empleadoModel;
    this.inspeccionSiniestroModel = inspeccionSiniestroModel;
    this.inspeccionIndemnizacionModel = inspeccionIndemnizacionModel;
    this.polizaModel = polizaModel;
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

    return res.status(200).json({ success: true });
  }

  delete = async (req, res) => {
    const { documento } = req.params;

    const inspeccionSiniestroExists = await this.inspeccionSiniestroModel.getByInspector(documento);

    if(inspeccionSiniestroExists.length > 0) {
      return res.status(400).json({ success: false, error: "El inspector tiene inspecciones de siniestro" });
    }

    const inspeccionIndemnizacionExists = await this.inspeccionIndemnizacionModel.getByInspector(documento);

    if(inspeccionIndemnizacionExists.length > 0) {
      return res.status(400).json({ success: false, error: "El inspector tiene inspecciones de indemnizacion" });
    }

    const polizaExists = await this.polizaModel.getByAsesor(documento);

    if(polizaExists.length > 0) {
      return res.status(400).json({ success: false, error: "El asesor tiene polizas" });
    }
    
    const result = await this.empleadoModel.delete(documento);

    if(!result)
      return res.status(500).json({ success: false, error: "Error al eliminar empleado" });

    return res.status(200).json({ sucess: true });
  }

  login = async (req, res) => {
    const credentials = validateCredenciales(req.body);

    if (!credentials.success) {
      return res.status(400).json({ success: false, error: credentials.error });
    }

    const { documento, contrasena } = credentials.data;

    const user = await this.empleadoModel.getContrasena(documento);

    if (!user) {
      return res.status(400).json({ success: false, error: "Credenciales invalidas" });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Credenciales invalidas" });
    }

    const token = jwt.sign({ documento: documento }, process.env.JWT_SECRET, { expiresIn: 14400 });

    return res.status(200).json({ token });
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
      return res.status(500).json({ error: "Error al cambiar contraseña" });
    }

    return res.status(200).json({ sucess: result });
  }
}
import { validatePartialReparacion, validateReparacion } from "../schemas/reparacion.schema.js";

export default class ReparacionController {
  constructor({ reparacionModel, indemnizacionModel, tallerModel, pagoReparacionModel, repuestoReparacionModel }) {
    this.reparacionModel = reparacionModel;
    this.indemnizacionModel = indemnizacionModel;
    this.tallerModel = tallerModel;
    this.pagoReparacionModel = pagoReparacionModel;
    this.repuestoReparacionModel = repuestoReparacionModel;
  }

  getAll = async (req, res) => {
    const reparaciones = await this.reparacionModel.getAll();

    res.json(reparaciones);
  }

  getById = async (req, res) => {
    const { id } = req.params;
    const reparacion = await this.reparacionModel.getById(id);

    res.json(reparacion);
  }

  getByTaller = async (req, res) => {
    const { rif } = req.params;
    const reparaciones = await this.reparacionModel.getByTaller(rif);

    res.json(reparaciones);
  }

  getByIndemnizacion = async (req, res) => {
    const { id } = req.params;
    const reparaciones = await this.reparacionModel.getByIndemnizacion(id);

    res.json(reparaciones);
  }

  create = async (req, res) => {
    const newReparacion = validateReparacion(req.body);

    if(!newReparacion.success){
      return res.status(400).json({error: newReparacion.error});
    }

    const indemnizacionExist = await this.indemnizacionModel.getById(newReparacion.data.indemnizacion_id);

    if (!indemnizacionExist) {
      return res.status(400).json({ error: "Indemnizacion no existe" });
    }

    const tallerExist = await this.tallerModel.getById(newReparacion.data.taller_rif);

    if (!tallerExist) {
      return res.status(400).json({ error: "Taller no existe" });
    }

    const result = await this.reparacionModel.create(newReparacion.data);

    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({ message: "Error al crear la reparacion" });
    }
  }

  update = async (req, res) => {
    const { id } = req.params;
    const reparacion = validatePartialReparacion(req.body);

    if (!reparacion.success) {
      return res.status(400).json({ error: reparacion.error
      });
    }

    const result = await this.reparacionModel.update(id, reparacion.data);

    if (result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ message: "Error al actualizar la reparacion" });
    }
  }

  delete = async (req, res) => {
    const { id } = req.params;

    const pagoReparacionExist = await this.pagoReparacionModel.getByReparacion(id)

    if(pagoReparacionExist.length > 0)
      return res.status(400).json({success: false, error: "La reparacion tiene pagos asociados"})

    const repuestoReparacionExist = await this.repuestoReparacionModel.getByReparacion(id)

    if(repuestoReparacionExist.length > 0)
      return res.status(400).json({success: false, error:"La reparacion tiene repuestos asociados"})

    const result = await this.reparacionModel.delete(id);

    if (result) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: "Error al eliminar la reparacion" });
    }
  }
}

export default class TipoEmpleadoController {
  constructor({ tipoEmpleadoModel }) {
    this.tipoEmpleadoModel = tipoEmpleadoModel;
  }

  getAll = async (req, res) => {
    const result = await this.tipoEmpleadoModel.getAll();

    return res.status(200).json(result);
  }

}
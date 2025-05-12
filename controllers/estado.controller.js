
export default class EstadoController {
  constructor({ estadoModel }) {
    this.estadoModel = estadoModel;
  }

  getAll = async (req, res) => {
    const result = await this.estadoModel.getAll();

    return res.status(200).json(result);
  }

}
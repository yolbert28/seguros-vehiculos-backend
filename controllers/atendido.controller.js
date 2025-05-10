
export default class AtendidoController {
  constructor({ atendidoModel }) {
    this.atendidoModel = atendidoModel;
  }

  getAll = async (req, res) => {
    const result = await this.atendidoModel.getAll();

    return res.status(200).json(result);
  }

}
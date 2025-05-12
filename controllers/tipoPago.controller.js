
export default class TipoPagoController {
  constructor({ tipoPagoModel }) {
    this.tipoPagoModel = tipoPagoModel;
  }

  getAll = async (req, res) => {
    const result = await this.tipoPagoModel.getAll();

    return res.status(200).json(result);
  }

}
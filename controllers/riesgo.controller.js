
export default class RiesgoController {
  constructor({ riesgoModel }) {
    this.riesgoModel = riesgoModel;
  }

  getAll = async (req, res) => {
    const result = await this.riesgoModel.getAll();

    return res.status(200).json(result);
  }

}
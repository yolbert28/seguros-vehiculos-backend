
export default class PaganteController {
  constructor({ paganteModel }) {
    this.paganteModel = paganteModel;
  }

  getAll = async (req, res) => {
    const result = await this.paganteModel.getAll();

    return res.status(200).json(result);
  }

}
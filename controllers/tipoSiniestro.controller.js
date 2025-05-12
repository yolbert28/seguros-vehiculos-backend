
export default class TipoSiniestroController {
  constructor({ tipoSiniestroModel }) {
    this.tipoSiniestroModel = tipoSiniestroModel;
  }

  getAll = async (req, res) => {
    const result = await this.tipoSiniestroModel.getAll();

    return res.status(200).json(result);
  }

}

export default class TipoEvidenciaController {
  constructor({ tipoEvidenciaModel }) {
    this.tipoEvidenciaModel = tipoEvidenciaModel;
  }

  getAll = async (req, res) => {
    const result = await this.tipoEvidenciaModel.getAll();

    return res.status(200).json(result);
  }

}
import { turso } from "./connection/dbConnection.js";

export default class TipoEvidenciaModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM tipo_evidencia")

    return result.rows;
  }
}
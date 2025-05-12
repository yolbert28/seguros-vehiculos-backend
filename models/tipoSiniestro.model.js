import { turso } from "./connection/dbConnection.js";

export default class TipoSiniestroModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM tipo_siniestro")

    return result.rows;
  }
}
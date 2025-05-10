import { turso } from "./connection/dbConnection.js";

export default class AtendidoModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM atendido")

    return result.rows;
  }
}
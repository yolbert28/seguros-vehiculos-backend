import { turso } from "./connection/dbConnection.js";

export default class EstadoModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM estado")

    return result.rows;
  }
}
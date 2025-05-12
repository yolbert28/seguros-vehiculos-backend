import { turso } from "./connection/dbConnection.js";

export default class TipoPagoModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM tipo_pago")

    return result.rows;
  }
}
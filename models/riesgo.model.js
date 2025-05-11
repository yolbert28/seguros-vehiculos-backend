import { turso } from "./connection/dbConnection.js";

export default class RiesgoModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM riesgo")

    return result.rows;
  }
}
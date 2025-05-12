import { turso } from "./connection/dbConnection.js";

export default class PaganteModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM pagante")

    return result.rows;
  }
}
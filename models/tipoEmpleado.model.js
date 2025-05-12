import { turso } from "./connection/dbConnection.js";

export default class TipoEmpleadoModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM tipo_empleado")

    return result.rows;
  }
}
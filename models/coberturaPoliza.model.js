import { turso } from "./connection/dbConnection.js";

export default class CoberturaPolizaModel {

  static async getById(coberturaId, polizaId) {
    const result = await turso.execute("SELECT * FROM cobertura_poliza WHERE cobertura_id = ? AND poliza_id = ?",
      [coberturaId, polizaId]
    )

    return result.rows[0];
  }

  static async getByPoliza (id) {
    const result = await turso.execute("SELECT * FROM cobertura_poliza WHERE poliza_id = ?",
      [id]
    )

    return result.rows;
  }

  static async create(coberturaPoliza) {

    const { cobertura_id, poliza_id } = coberturaPoliza;

    try {
      await turso.execute(
        "INSERT INTO cobertura_poliza(cobertura_id, poliza_id ) VALUES (?,?)",
        [cobertura_id, poliza_id]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async delete(coberturaPoliza) {

    const { cobertura_id, poliza_id } = coberturaPoliza;
    
    try {
      await turso.execute(
        "DELETE FROM cobertura_poliza WHERE cobertura_id = ? AND poliza_id = ?",
        [cobertura_id, poliza_id]
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
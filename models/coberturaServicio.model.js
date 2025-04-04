import { turso } from "./connection/dbConnection.js";

export default class CoberturaServicioModel {

  static async getById(coberturaId, servicioId) {
    const result = await turso.execute("SELECT * FROM cobertura_servicio WHERE cobertura_id = ? AND servicio_id = ?",
      [coberturaId, servicioId]
    )

    return result.rows;
  }

  static async getByCobertura (id) {
    const result = await turso.execute("SELECT * FROM cobertura_servicio WHERE cobertura_id = ?",
      [id]
    )

    return result.rows;
  }

  static async create(coberturaServicio) {

    const { cobertura_id, servicio_id } = coberturaServicio;

    try {
      await turso.execute(
        "INSERT INTO cobertura_servicio (cobertura_id, servicio_id ) VALUES (?,?)",
        [cobertura_id, servicio_id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async delete(coberturaServicio) {

    const { cobertura_id, servicio_id } = coberturaServicio;
    
    try {
      await turso.execute(
        "DELETE FROM cobertura_servicio WHERE cobertura_id = ? AND servicio_id = ?",
        [cobertura_id, servicio_id]
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
import { turso } from "./connection/dbConnection.js";

export default class IndemnizacionModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM indemnizacion");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM indemnizacion WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getBySiniestroId(siniestroId) {
    const result = await turso.execute("SELECT * FROM indemnizacion WHERE siniestro_id = ?", [siniestroId]);

    return result.rows;
  }

  static async create(indemnizacion) {
    const { siniestro_id, descripcion, monto } = indemnizacion;

    try {
      const result = await turso.execute(
        "INSERT INTO indemnizacion (siniestro_id, descripcion, monto_reclamado) VALUES (?, ?, ?) RETURNING *",
        [siniestro_id, descripcion, monto]
      )

      return { success: true, data: result.rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false }
    }
  }

  static async update(id, indemnizacion) {
    const { descripcion, monto } = indemnizacion;

    try {
      await turso.execute(
        "UPDATE indemnizacion SET descripcion = ?, monto_reclamado = ? WHERE id = ?",
        [descripcion, monto, id]
      )

      return true;
    } catch (e) {
      console.error(e);
      return false
    }
  }

  static async delete(id){
    try {
      await turso.execute("DELETE FROM indemnizacion WHERE id = ?", [id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
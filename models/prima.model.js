import { turso } from "./connection/dbConnection.js";

export default class PrimaModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM prima")

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM prima WHERE id = ?", [id])

    return result.rows[0];
  }

  static async getByPoliza(poliza_id) {
    const result = await turso.execute("SELECT * FROM prima WHERE poliza_id = ?", [poliza_id])

    return result.rows;
  }

  static async create(input) {
    const { poliza_id, monto, fecha } = input;

    try {
      await turso.execute("INSERT INTO prima (poliza_id, monto, fecha) VALUES (?,?,?)",
        [poliza_id, monto, fecha]);

      const result = await turso.execute("SELECT * FROM prima WHERE id = (SELECT MAX(id) FROM prima)")

      return { success: true, data: result.rows[0] }
    } catch (e) {
      console.log(e)
      return { success: false };
    }
  }

  static async update(id, input) {
    const { monto, fecha } = input;

    try {
      await turso.execute("UPDATE prima SET monto = ? ,fecha = ? WHERE id = ?",
        [monto, fecha, id]);

      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM prima WHERE id = ?", [id]);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
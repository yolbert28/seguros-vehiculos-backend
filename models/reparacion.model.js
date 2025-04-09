import { turso } from "./connection/dbConnection.js";

export default class ReparacionModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM reparacion");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM reparacion WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByTaller(taller_rif) {
    const result = await turso.execute("SELECT * FROM reparacion WHERE taller_rif = ?", [taller_rif]);

    return result.rows;
  }

  static async getByIndemnizacion(id) {
    const result = await turso.execute("SELECT * FROM reparacion WHERE indemnizacion_id = ?", [id]);

    return result.rows;
  }

  static async create(reparacion) {
    const { indemnizacion_id, taller_rif, descripcion, monto } = reparacion;

    try {
      const result = await turso.execute("INSERT INTO reparacion (indemnizacion_id, taller_rif, descripcion, monto) VALUES (?, ?, ?, ?) RETURNING *;", [indemnizacion_id, taller_rif, descripcion, monto]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, reparacion) {
    const { descripcion, monto } = reparacion;

    try {
      const result = await turso.execute("UPDATE reparacion SET descripcion = ?, monto = ? WHERE id = ? ", [descripcion, monto, id]);

      return true
    } catch (error) {
      console.log(error);
      return false 
    }
  }

  static async delete(id) {
    try {
      const result = await turso.execute("DELETE FROM reparacion WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
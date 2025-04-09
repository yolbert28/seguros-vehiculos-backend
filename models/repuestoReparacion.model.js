import { turso } from "./connection/dbConnection.js";

export default class RepuestoReparacionModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM repuesto_reparacion");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM repuesto_reparacion WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByReparacion(reparacion_id) {
    const result = await turso.execute("SELECT * FROM repuesto_reparacion WHERE reparacion_id = ?", [reparacion_id]);

    return result.rows;
  }

  static async create(repuestoReparacion) {

    const { reparacion_id, nombre, cantidad, precio } = repuestoReparacion;

    try {
      const result = await turso.execute(
        "INSERT INTO repuesto_reparacion (reparacion_id, nombre, cantidad, precio ) VALUES (?,?,?,?) RETURNING *;",
        [reparacion_id, nombre, cantidad, precio]);
      return { success: true, data: result.rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }

  static async update(id, repuestoReparacion) {

    const { nombre, cantidad, precio } = repuestoReparacion;

    try {
      await turso.execute(
        "UPDATE repuesto_reparacion SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?",
        [nombre, cantidad, precio, id]
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM repuesto_reparacion WHERE id = ?", [id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
import { turso } from "./connection/dbConnection";

export default class reparacionModel {
  async getAll() {
    const result = await turso.execute("SELECT * FROM reparacion");

    return result.rows;
  }

  async getById(id) {
    const result = await turso.execute("SELECT * FROM reparacion WHERE id = ?", [id]);

    return result.rows[0];
  }

  async getByIndemnizacion(id) {
    const result = await turso.execute("SELECT * FROM reparacion WHERE indemnizacion_id = ?", [id]);

    return result.rows;
  }

  async create(reparacion) {
    const { indemnizacion_id, taller_rif, descripcion, monto } = reparacion;

    try {
      const result = await turso.execute("INSERT INTO reparacion (indemnizacion_id, taller_rif, descripcion, monto) VALUES (?, ?, ?, ?) RETURNING *;", [indemnizacion_id, taller_rif, descripcion, monto]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  async update(id, reparacion) {
    const { taller_rif, descripcion, monto } = reparacion;

    try {
      const result = await turso.execute("UPDATE reparacion SET taller_rif = ?, descripcion = ?, monto = ? WHERE id = ? ", [taller_rif, descripcion, monto, id]);

      return true
    } catch (error) {
      console.log(error);
      return false 
    }
  }

  async delete(id) {
    try {
      const result = await turso.execute("DELETE FROM reparacion WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
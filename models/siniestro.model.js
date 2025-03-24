import { turso } from "./connection/dbConnection.js";

export default class SiniestroModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM siniestro");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM siniestro WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByVehiculo(matricula) {
    const result = await turso.execute("SELECT * FROM siniestro WHERE vehiculo_mat = ?", [matricula]);

    return result.rows;
  }

  static async create(siniestro) {
    const { reporte_siniestro_id, vehiculo_mat, descripcion, lugar, monto_estimado, tipo_siniestro_id, fecha, estado } = siniestro;

    try {
      const result = await turso.execute("INSERT INTO siniestro (reporte_siniestro_id, vehiculo_mat, descripcion, lugar, monto_estimado, tipo_siniestro_id, fecha, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;", [reporte_siniestro_id, vehiculo_mat, descripcion, lugar, monto_estimado, tipo_siniestro_id, fecha, estado]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, siniestro) {
    const { descripcion, lugar, monto_estimado, tipo_siniestro_id, fecha, estado } = siniestro;

    try {
      await turso.execute("UPDATE siniestro SET descripcion = ?, lugar = ?, monto_estimado = ?, tipo_siniestro_id = ?, fecha = ?, estado = ? WHERE id = ?", [descripcion, lugar, monto_estimado, tipo_siniestro_id, fecha, estado, id]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM siniestro WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
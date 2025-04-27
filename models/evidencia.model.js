import { turso } from "./connection/dbConnection.js";

export default class EvidenciaModel {
  static async getAll() {
    const result = await turso.execute("SELECT e.*, te.nombre as nombre_tipo_evidencia FROM evidencia e, tipo_evidencia te WHERE e.tipo_evidencia = te.id");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT e.*, te.nombre as nombre_tipo_evidencia FROM evidencia e, tipo_evidencia te WHERE e.tipo_evidencia = te.id AND e.id = ?", [id]);

    return result.rows[0];
  }

  static async getBySiniestro(siniestro_id) {
    const result = await turso.execute("SELECT e.*, te.nombre as nombre_tipo_evidencia FROM evidencia e, tipo_evidencia te WHERE e.tipo_evidencia = te.id AND e.siniestro_id = ?", [siniestro_id]);

    return result.rows;
  }

  static async create(evidencia) {
    const { siniestro_id, tipo_evidencia, ruta_archivo } = evidencia;

    try {
      const result = await turso.execute("INSERT INTO evidencia (siniestro_id, tipo_evidencia, ruta_archivo) VALUES (?, ?, ?) RETURNING *;", [siniestro_id, tipo_evidencia, ruta_archivo]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, evidencia) {
    const { tipo_evidencia, ruta_archivo } = evidencia;

    try {
      await turso.execute("UPDATE evidencia SET tipo_evidencia = ?, ruta_archivo = ? WHERE id = ? ", [tipo_evidencia, ruta_archivo, id]);

      return true;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM evidencia WHERE id = ?;", [id]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
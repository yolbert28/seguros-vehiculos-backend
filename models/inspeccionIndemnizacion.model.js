import { turso } from "./connection/dbConnection.js";

export default class InspeccionIndemnizacionModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM inspeccion_indemnizacion");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM inspeccion_indemnizacion WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByIndemnizacionId(indemnizacionId) {
    const result = await turso.execute("SELECT * FROM inspeccion_indemnizacion WHERE indemnizacion_id = ?", [indemnizacionId]);

    return result.rows;
  }

  static async getByInspectorDoc(doc) {
    const result = await turso.execute("SELECT * FROM inspeccion_indemnizacion WHERE inspector_doc = ?", [doc]);

    return result.rows;
  }

  static async create(inspeccionIndemnizacion) {
    const { indemnizacion_id, inspector_doc, descripcion, fecha } = inspeccionIndemnizacion;

    try {
      const result = await turso.execute(
        "INSERT INTO inspeccion_indemnizacion (indemnizacion_id, inspector_doc, fecha, descripcion) VALUES (?, ?, ?, ?) RETURNING *",
        [indemnizacion_id, inspector_doc, fecha, descripcion]
      )

      return { success: true, data: result.rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false }
    }
  }

  static async update(id, inspeccionIndemnizacion) {
    const { descripcion, fecha } = inspeccionIndemnizacion;

    try {
      await turso.execute(
        "UPDATE inspeccion_indemnizacion SET fecha = ?, descripcion = ? WHERE id = ?",
        [fecha, descripcion, id]
      )

      return true;
    } catch (e) {
      console.error(e);
      return false
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM inspeccion_indemnizacion WHERE id = ?", [id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
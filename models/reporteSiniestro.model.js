import { turso } from "./connection/dbConnection.js";

export default class ReporteSiniestroModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM reporte_siniestro");
    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM reporte_siniestro WHERE id = ?", [id]);
    return result.rows[0];
  }

  static async getByNotAtendido() {
    const result = await turso.execute("SELECT * FROM reporte_siniestro WHERE atendido = 2 ORDER BY id DESC");
    return result.rows;
  }

  static async getByCliente(documento) {
    const result = await turso.execute("SELECT * FROM reporte_siniestro WHERE cliente_doc = ?", [documento]);
    return result.rows;
  }

  static async create(reporteSiniestro) {
    const { cliente_doc, descripcion, direccion, fecha } = reporteSiniestro;
    try {
      const result = await turso.execute(
        "INSERT INTO reporte_siniestro (cliente_doc, descripcion, direccion, fecha, atendido) VALUES (?, ?, ?, ?, 2) RETURNING *;",
        [cliente_doc, descripcion, direccion, fecha]
      );
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  // FUNCIÓN UPDATE DINÁMICA PARA UPDATES PARCIALES
  static async update(id, reporteSiniestro) {
    // Construir dinámicamente el SET de la consulta
    const fields = [];
    const values = [];
    for (const key in reporteSiniestro) {
      fields.push(`${key} = ?`);
      values.push(reporteSiniestro[key]);
    }
    if (fields.length === 0) return false;
    values.push(id);

    const sql = `UPDATE reporte_siniestro SET ${fields.join(', ')} WHERE id = ?`;

    try {
      await turso.execute(sql, values);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM reporte_siniestro WHERE id = ?;", [id]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
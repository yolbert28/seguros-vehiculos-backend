export default class ReporteSiniestroModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM reporte_siniestro");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM reporte_siniestro WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByCliente(documento) {
    const result = await turso.execute("SELECT * FROM reporte_siniestro WHERE cliente_doc = ?", [documento]);

    return result.rows;
  }

  static async create(reporteSiniestro) {
    const { cliente_doc, descripcion, direccion, fecha } = reporteSiniestro;

    try {
      const result = await turso.execute("INSERT INTO reporte_siniestro (cliente_doc, descripcion, direccion, fecha, atendido) VALUES (?, ?, ?, ?, TRUE) RETURNING *;", [cliente_doc, descripcion, direccion, fecha]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, reporteSiniestro) {
    const { descripcion, direccion } = reporteSiniestro;

    try {
      await turso.execute("UPDATE reporte_siniestro SET cliente_doc = ?, descripcion = ?, direccion = ? WHERE id = ?", [descripcion, direccion, id]);

      return true;
    } catch (error) {
      console.log(error);
      return false
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
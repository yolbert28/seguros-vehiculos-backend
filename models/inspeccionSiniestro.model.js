export default class InspeccionSiniestroModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM inspeccion_siniestro");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM inspeccion_siniestro WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getBySiniestro(siniestro_id) {
    const result = await turso.execute("SELECT * FROM inspeccion_siniestro WHERE siniestro_id = ?", [siniestro_id]);

    return result.rows;
  }

  static async getByInspector(doc) {
    const result = await turso.execute("SELECT * FROM inspeccion_siniestro WHERE inspector_doc = ?", [doc]);

    return result.rows;
  }

  static async create(inspeccionSiniestro) {
    const { siniestro_id, inspector_doc, descripcion, fecha } = inspeccionSiniestro;

    try {
      const result = await turso.execute("INSERT INTO inspeccion_siniestro (siniestro_id, inspector_doc, descripcion, fecha) VALUES (?, ?, ?, ?) RETURNING *", [siniestro_id, inspector_doc, descripcion, fecha]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  static async update(id, inspeccionSiniestro) {
    const { descripcion, fecha } = inspeccionSiniestro;

    try {
      await turso.execute("UPDATE inspeccion_siniestro SET descripcion = ?, fecha = ? WHERE id = ?", [descripcion, fecha, id]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM inspeccion_siniestro WHERE id = ?", [id]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
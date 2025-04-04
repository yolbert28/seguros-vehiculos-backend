import { turso } from "./connection/dbConnection.js";

export default class PolizaModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM poliza");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM poliza WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByCliente(documento) {
    const result = await turso.execute("SELECT * FROM poliza WHERE cliente_doc = ?", [documento]);

    return result.rows;
  }

  static async getByAsesor(documento) {
    const result = await turso.execute("SELECT * FROM poliza WHERE asesor_doc = ?", [documento]);

    return result.rows;
  }

  static async create(input) {
    const { cliente_doc, asesor_doc,fecha_fin, tipo_pago } = input;

    const fechaCreacion = new Date().toISOString().slice(0, 10);

    try {
      await turso.execute(
        "INSERT INTO poliza (cliente_doc, asesor_doc, fecha_creacion, fecha_fin, tipo_pago) VALUES (?, ?, ?, ?, ?)",
        [cliente_doc, asesor_doc, fechaCreacion, fecha_fin, tipo_pago]
      );

      const result = await turso.execute("SELECT * FROM poliza WHERE id = (SELECT MAX(id) FROM poliza)");

      return {success: true, data:result.rows[0]};
    } catch (error) {
      console.error(error);
      return {success: false};
    }
  }

  static async update(id, input) {
    const { cliente_doc, asesor_doc, fecha_fin, tipo_pago} = input;

    try {
      await turso.execute(
        "UPDATE poliza SET cliente_doc = ?, asesor_doc = ?, fecha_fin = ?, tipo_pago = ? WHERE id = ?",
        [cliente_doc, asesor_doc, fecha_fin, tipo_pago, id]
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute(
        "DELETE FROM poliza WHERE id = ?",
        [id]
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
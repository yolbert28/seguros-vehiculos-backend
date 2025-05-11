import { turso } from "./connection/dbConnection.js";

export default class CoberturaModel {
  
  static async getAll() {
    const result = await turso.execute("SELECT * FROM cobertura");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM cobertura WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getCoberturasByPoliza(polizaId) {
    const result = await turso.execute("SELECT c.* FROM cobertura c, cobertura_poliza cp WHERE c.id = cp.cobertura_id AND cp.poliza_id = ?", [polizaId]);

    return result.rows;
  }

  static async getByNombreAndNotId(nombre, id) {
    const result = await turso.execute("SELECT * FROM cobertura WHERE nombre = ? AND id != ?", [nombre, id]);

    return result.rows;
  }

  static async getByNombre(nombre) {
    const result = await turso.execute("SELECT * FROM cobertura WHERE nombre = ?", [nombre]);

    return result.rows;
  }

  static async create({ input }) {
    const { nombre, descripcion, monto } = input;

    try {
      await turso.execute("INSERT INTO cobertura (nombre, descripcion, monto) VALUES (?, ?, ?)", [nombre, descripcion, monto]);
    } catch (e) {
      console.log(e);
      return { success: false };
    }

    const cobertura = await turso.execute(
      "SELECT * FROM cobertura WHERE id = (SELECT MAX(id) FROM cobertura)",
    );

    return { success: true, data: cobertura.rows[0] };
  }

  static async update({ id, input }) {
    const { nombre, descripcion, monto } = input;

    try {
      await turso.execute("UPDATE cobertura SET nombre = ?, descripcion = ?, monto = ? WHERE id = ?", [nombre, descripcion, monto, id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM cobertura WHERE id = ?", [id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

}
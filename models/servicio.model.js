import { turso } from "./connection/dbConnection.js";

export default class ServicioModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM servicio");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM servicio WHERE id = ?", [id]);

    return result.rows;
  }

  static async getByNombreAndNotId(nombre, id) {
    const result = await turso.execute("SELECT * FROM servicio WHERE nombre = ? AND id != ?", [nombre, id]);

    return result.rows;
  }

  static async getByNombre(nombre) {
    const result = await turso.execute("SELECT * FROM servicio WHERE nombre = ?", [nombre]);

    return result.rows;
  }

  static async create({ input }) {
    const { nombre, descripcion, monto } = input;

    try {
      await turso.execute("INSERT INTO servicio (nombre, descripcion, monto) VALUES (?, ?, ?)", [nombre, descripcion, monto]);
    } catch (e) {
      console.log(e);
      return { success: false };
    }

    const servicio = await turso.execute(
      "SELECT * FROM servicio WHERE id = (SELECT MAX(id) FROM servicio)",
    );

    return { success: true, data: servicio.rows[0] };
  }

  static async update({ id, input }) {
    const { nombre, descripcion, monto } = input;

    try {
      await turso.execute("UPDATE servicio SET nombre = ?, descripcion = ?, monto = ? WHERE id = ?", [nombre, descripcion, monto, id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM servicio WHERE id = ?", [id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
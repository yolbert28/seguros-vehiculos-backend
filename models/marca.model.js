import { turso } from "./connection/dbConnection.js";

export default class MarcaModel {

  static async getAll() {
    const result = await turso.execute("SELECT * FROM marca");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM marca WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByNombre(nombre) {
    const result = await turso.execute("SELECT * FROM marca WHERE nombre = ?", [nombre]);

    return result.rows;
  }

  static async getByNombreAndNotId({ nombre, id }) {
    const result = await turso.execute("SELECT * FROM marca WHERE nombre = ? AND id != ?", [nombre, id]);

    return result.rows;
  }

  static async create({ input }) {
    const { nombre } = input;

    try {
      const marca = await turso.execute("INSERT INTO marca (nombre) VALUES (?) RETURNING *;", [nombre]);

      return { success: true, data: marca.rows[0] };
    } catch (e) {
      console.log(e);
      return { success: false };
    }

  }

  static async update({ id, input }) {
    const { nombre } = input;

    try {
      await turso.execute("UPDATE marca SET nombre = ? WHERE id = ?", [nombre, id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM marca WHERE id = ?", [id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
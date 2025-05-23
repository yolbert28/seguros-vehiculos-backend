import { turso } from "./connection/dbConnection.js";

export default class ModeloModel {

  static async getAll() {
    const result = await turso.execute("SELECT m.*,ma.nombre as marca FROM modelo m, marca ma WHERE m.marca_id = ma.id");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT m.*,ma.nombre as marca FROM modelo m, marca ma WHERE m.id = ? AND m.marca_id = ma.id", [id]);

    return result.rows[0];
  }

  static async getByMarca(id) {
    const result = await turso.execute("SELECT m.*,ma.nombre as marca FROM modelo m, marca ma WHERE ma.id = ? AND m.marca_id = ma.id", [id]);

    return result.rows;
  }

  static async getByNombreAndNotId(nombre, id) {
    const result = await turso.execute("SELECT * FROM modelo WHERE nombre = ? AND id != ? COLLATE NOCASE", [nombre, id]);

    return result.rows;
  }

  static async getByNombreAndNotMarcaId(nombre, marcaId) {
    const result = await turso.execute("SELECT * FROM modelo WHERE nombre = ? AND marca_id = ? COLLATE NOCASE", [nombre, marcaId]);

    return result.rows;
  }

  static async getByNombre(nombre) {
    const result = await turso.execute("SELECT * FROM modelo WHERE nombre = ? COLLATE NOCASE", [nombre]);

    return result.rows;
  }

  static async create({ input }) {
    const { nombre, marca_id } = input;

    try {
      await turso.execute("INSERT INTO modelo (nombre, marca_id) VALUES (?, ?)", [nombre, marca_id]);
    } catch (e) {
      console.log(e);
      return { success: false };
    }

    const modelo = await turso.execute(
      "SELECT * FROM modelo WHERE id = (SELECT MAX(id) FROM modelo)",
    );

    return { success: true, data: modelo.rows[0] };
  }

  static async update({ id, input }) {
    const { nombre, marca_id } = input;

    try {
      await turso.execute("UPDATE modelo SET nombre = ?, marca_id = ? WHERE id = ?", [nombre, marca_id, id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM modelo WHERE id = ?", [id]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
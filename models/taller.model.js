import { turso } from "./connection/dbConnection.js";

export default class TallerModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM taller");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM taller WHERE rif = ?", [id]);

    return result.rows[0];
  }

  static async getByName(name) {
    const result = await turso.execute("SELECT * FROM taller WHERE nombre = ?", [name]);

    return result.rows;
  }

  static async getByNameAndNotRif(name, rif) {
    const result = await turso.execute("SELECT * FROM taller WHERE nombre = ? AND rif != ?", [name, rif]);

    return result.rows;
  }

  static async getByCorreo(correo) {
    const result = await turso.execute("SELECT * FROM taller WHERE correo = ?", [correo]);

    return result.rows;
  }

  static async getByCorreoAndNotRif(correo, rif) {
    const result = await turso.execute("SELECT * FROM taller WHERE correo = ? AND rif != ?", [correo, rif]);

    return result.rows;
  }

  static async create(taller) {
    const { rif, nombre, direccion, telefono, correo } = taller;

    try {
      const result = await turso.execute("INSERT INTO taller (rif, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?) RETURNING *;", [rif, nombre, direccion, telefono, correo]);

      return { success: true, data: result.rows[0] };
    } catch (e) {
      console.log(e);
      return { success: false }
    }
  }

  static async update(rif, taller) {
    const { nombre, direccion, telefono, correo } = taller;

    try {
      await turso.execute("UPDATE taller SET nombre = ?, direccion = ?, telefono = ?, correo = ?WHERE rif = ?", [nombre, direccion, telefono, correo, rif]);

      return true
    } catch (e) {
      console.log(e);
      return false
    }
  }

  static async delete(rif) {
    try {
      await turso.execute("DELETE FROM taller WHERE rif = ?", [rif]);

      return true;
    } catch (e) {
      console.log(e);
      return false
    }
  }
}
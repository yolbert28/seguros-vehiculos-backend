import { turso } from "./connection/dbConnection.js";

export default class ClienteModel {

  static async getAll() {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, direccion FROM cliente");

    return result.rows;
  }

  static async getById(documento) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, direccion FROM cliente WHERE documento = ?", [documento]);

    return result.rows[0];
  }

  static async getByEmail(correo) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, direccion FROM cliente WHERE correo = ?", [correo]);

    return result.rows[0];
  }

  static async getContrasena(documento) {
    const result = await turso.execute("SELECT * FROM cliente WHERE documento = ?", [documento]);

    return result.rows[0];
  }

  static async getByEmailAndNotId(correo, documento) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, direccion FROM cliente WHERE correo = ? AND documento != ?", [correo, documento]);

    return result.rows;
  }

  static async create({ input }) {
    const { documento, nombre, correo, telefono, direccion, contrasena } = input;

    try {
      await turso.execute("INSERT INTO cliente (documento, nombre, correo, telefono, direccion, contrasena) VALUES (?, ?, ?, ?, ?, ?)", [documento, nombre, correo, telefono, direccion, contrasena]);
    } catch (e) {
      console.log(e);
      return { success: false };
    }

    const cliente = await turso.execute(
      "SELECT documento, nombre, correo, telefono, direccion FROM cliente WHERE documento = ?",
      [documento]
    );

    return { success: true, data: cliente.rows[0] };
  }

  static async update({ documento, input }) {
    const { nombre, correo, telefono, direccion, contrasena } = input;

    try {
      await turso.execute("UPDATE cliente SET nombre = ?, correo = ?, telefono = ?, direccion = ? WHERE documento = ?", [nombre, correo, telefono, direccion, documento]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async delete(documento) {
    try {
      await turso.execute("DELETE FROM cliente WHERE documento = ?", [documento]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  static async changePassword({ documento, contrasena }) {
    try {
      await turso.execute("UPDATE cliente SET contrasena = ? WHERE documento = ?", [contrasena, documento]);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }
}
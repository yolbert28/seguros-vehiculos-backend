import { turso } from "./connection/dbConnection.js";

export default class EmpleadoModel {
  static async getAll() {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, tipo_empleado_id  FROM empleado");

    return result.rows;
  }

  static async getById(documento) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, tipo_empleado_id FROM empleado WHERE documento = ?", [documento]);

    return result.rows[0];
  }

  static async getContrasena(documento) {
    const result = await turso.execute("SELECT contrasena FROM empleado WHERE documento = ?", [documento]);

    return result.rows[0];
  }
  
  static async getByCorreo(correo) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, tipo_empleado_id  FROM empleado WHERE correo = ?", [correo]);

    return result.rows[0];
  }

  static async getByCorreoAndNotDocumento(correo, documento) {
    const result = await turso.execute("SELECT documento, nombre, correo, telefono, tipo_empleado_id FROM empleado WHERE correo = ? AND documento != ?", [correo, documento]);

    return result.rows[0];
  }

  static async create(input) {
    const { documento, nombre, correo, telefono, tipo_empleado, contrasena } = input;

    try {
      await turso.execute(
        "INSERT INTO empleado (documento, nombre, correo, telefono, tipo_empleado_id, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
        [documento, nombre, correo, telefono, tipo_empleado, contrasena]
      );

      const result = await turso.execute("SELECT documento, nombre, correo, telefono, tipo_empleado_id FROM empleado WHERE documento = ?", [documento]);

      return {success: true, data:result.rows[0]};
    } catch (error) {
      console.error(error);
      return {success: false};
    }
  }

  static async update(documento, input) {
    const { nombre, correo, telefono, tipo_empleado} = input;

    try {
      await turso.execute(
        "UPDATE empleado SET nombre = ?, correo = ?, telefono = ?, tipo_empleado_id = ? WHERE documento = ?",
        [nombre, correo, telefono, tipo_empleado, documento]
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async delete(documento) {
    try {
      await turso.execute("DELETE FROM empleado WHERE documento = ?", [documento]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async changePassword(documento, contrasena) {
    try {
      await turso.execute("UPDATE empleado SET contrasena = ? WHERE documento = ?", [contrasena, documento]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
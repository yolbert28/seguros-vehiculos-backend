import { turso } from "./connection/dbConnection.js";

export default class repuestoSiniestroModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM repuesto_siniestro")

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM repuesto_siniestro WHERE id = ?", [id])

    return result.rows[0];
  }

  static async getByInspeccion(id) {
    const result = await turso.execute("SELECT * FROM repuesto_siniestro WHERE inspeccion_siniestro_id = ?", [id])

    return result.rows;
  }

  static async getByNombreAndInspeccion(nombre,inspeccionId) {
    const result = await turso.execute("SELECT * FROM repuesto_siniestro WHERE nombre = ? AND inspeccion_siniestro_id = ?", [nombre, inspeccionId])

    return result.rows;
  }

  static async create(input) {
    const { inspeccion_siniestro_id, nombre, cantidad } = input;

    try {
      await turso.execute("INSERT INTO repuesto_siniestro(inspeccion_siniestro_id, nombre,cantidad) VALUES (?,?,?)", [inspeccion_siniestro_id, nombre, cantidad])

      const result = await turso.execute("SELECT * FROM repuesto_siniestro WHERE id = (SELECT MAX(id) FROM repuesto_siniestro)")

      return { success: true, data: result.rows[0] }
    } catch (e) {
      console.log(e);
      return { success: false }
    }
  }

  static async update(id, input) {
    const { nombre, cantidad } = input;

    try {
      await turso.execute("UPDATE repuesto_siniestro SET nombre = ?, cantidad = ? WHERE id = ?", [nombre, cantidad, id])

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM repuesto_siniestro WHERE id = ?", [id])
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
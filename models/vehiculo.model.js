import { turso } from "./connection/dbConnection.js";

export default class VehiculoModel {
  static async getAll() {
    const result = await turso.execute("SELECT * FROM vehiculo");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM vehiculo WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getByPoliza(poliza_id) {
    const result = await turso.execute("SELECT * FROM vehiculo WHERE poliza_id = ?", [poliza_id]);

    return result.rows;
  }

  static async create(vehiculo) {
    const { matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion } = vehiculo;


    const fecha = new Date().toISOString().slice(0, 10);

    try {
      const result = await turso.execute("INSERT INTO vehiculo (matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion, ultima_actualizacion) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *;", [matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion, fecha]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, vehiculo) {
    const { modelo_id, riesgo_id, capacidad_carga, anno, valoracion } = vehiculo;


    const fecha = new Date().toISOString().slice(0, 10);

    try {
      await turso.execute("UPDATE vehiculo SET modelo_id = ?, riesgo_id = ?, capacidad_carga = ?, anno = ?, valoracion = ?, ultima_actualizacion = ? ", [ modelo_id, riesgo_id, capacidad_carga, anno, valoracion, fecha]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async delete(matricula) {
    try {
      await turso.execute("DELETE FROM vehiculo WHERE matricula = ?", [ matricula ]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
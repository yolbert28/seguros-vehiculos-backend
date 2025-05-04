import { turso } from "./connection/dbConnection.js";

export default class VehiculoModel {
  static async getAll() {
    const result = await turso.execute("SELECT v.*, r.nombre as riesgo, m.nombre as modelo, ma.nombre as marca FROM vehiculo v , riesgo r, modelo m, marca ma WHERE v.riesgo_id = r.id AND m.id = v.modelo_id AND m.marca_id = ma.id");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT v.*, r.nombre as riesgo, m.nombre as modelo, ma.nombre as marca, p.cliente_doc FROM vehiculo v , riesgo r, modelo m, marca ma, poliza p WHERE v.poliza_id = p.id AND m.id = v.modelo_id AND ma.id = m.marca_id AND v.riesgo_id = r.id AND v.matricula = ?", [id]);

    return result.rows[0];
  }

  static async getByModelo (modeloId) {
    const result = await turso.execute("SELECT v.*, r.nombre as riesgo, m.nombre as modelo, ma.nombre as marca FROM vehiculo v , riesgo r, modelo m, marca ma WHERE v.riesgo_id = r.id AND m.id = v.modelo_id AND m.marca_id = ma.id AND v.modelo_id = ?", [modeloId]);

    return result.rows;
  }

  static async getByPoliza(poliza_id) {
    const result = await turso.execute("SELECT v.*, r.nombre as riesgo, m.nombre as modelo, ma.nombre as marca FROM vehiculo v , riesgo r, modelo m, marca ma WHERE v.riesgo_id = r.id AND m.id = v.modelo_id AND m.marca_id = ma.id AND v.poliza_id = ?", [poliza_id]);

    return result.rows;
  }

  static async getByCliente(cliente_doc) {
    const result = await turso.execute("SELECT v.*, r.nombre as riesgo, m.nombre as modelo, ma.nombre as marca FROM vehiculo v , riesgo r, modelo m, marca ma, poliza p WHERE v.riesgo_id = r.id AND m.id = v.modelo_id AND m.marca_id = ma.id AND p.id = v.poliza_id AND p.cliente_doc = ?", [cliente_doc]);

    return result.rows;
  }

  static async create(vehiculo) {
    const { matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion } = vehiculo;


    const fecha = new Date().toISOString().slice(0, 10);

    try {
      const result = await turso.execute("INSERT INTO vehiculo (matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion, ultima_actualizacion) VALUES (?, ?, ?, ?, ?, ?, ?,?) RETURNING *;", [matricula, poliza_id, modelo_id, riesgo_id, capacidad_carga, anno, valoracion, fecha]);

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
      await turso.execute("UPDATE vehiculo SET modelo_id = ?, riesgo_id = ?, capacidad_carga = ?, anno = ?, valoracion = ?, ultima_actualizacion = ? WHERE matricula = ?", [ modelo_id, riesgo_id, capacidad_carga, anno, valoracion, fecha, matricula]);

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
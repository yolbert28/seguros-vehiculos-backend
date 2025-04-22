import { turso } from "./connection/dbConnection.js";

export default class MantenimientoModel { 
  static async getAll() {
    const result = await turso.execute("SELECT * FROM mantenimiento");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT * FROM mantenimiento WHERE id = ?", [id]);

    return result.rows[0];
  }

  static async getIfExpiresInTenDays(){
    const result = await turso.execute("SELECT c.nombre, c.correo, v.matricula, p.id, mo.nombre as modelo, ma.nombre as marca FROM mantenimiento m, vehiculo v, poliza p, cliente c, modelo mo, marca ma WHERE m.vehiculo_mat = v.matricula AND v.poliza_id = p.id AND p.cliente_doc = c.documento AND mo.id = v.modelo_id AND mo.marca_id = ma.id AND DATE(fecha,'+1 months') = Date('now', '+10 days');");

    return result.rows;
  }

  static async getIfExpiresInThreeDays(){
    const result = await turso.execute("SELECT c.nombre, c.correo, v.matricula, p.id, mo.nombre as modelo, ma.nombre as marca FROM mantenimiento m, vehiculo v, poliza p, cliente c, modelo mo, marca ma WHERE m.vehiculo_mat = v.matricula AND v.poliza_id = p.id AND p.cliente_doc = c.documento AND mo.id = v.modelo_id AND mo.marca_id = ma.id AND DATE(fecha,'+1 months') = Date('now', '+3 days');");

    return result.rows;
  }

  static async getIfExpiresToday(){
    const result = await turso.execute("SELECT c.nombre, c.correo, v.matricula, p.id, mo.nombre as modelo, ma.nombre as marca FROM mantenimiento m, vehiculo v, poliza p, cliente c, modelo mo, marca ma WHERE m.vehiculo_mat = v.matricula AND v.poliza_id = p.id AND p.cliente_doc = c.documento AND mo.id = v.modelo_id AND mo.marca_id = ma.id AND DATE(fecha,'+1 months') = Date('now');");

    return result.rows;
  }

  static async getByVehiculo(matricula) {
    const result = await turso.execute("SELECT * FROM mantenimiento WHERE vehiculo_mat = ?", [matricula]);

    return result.rows;
  }

  static async getByTaller(rif) {
    const result = await turso.execute("SELECT * FROM mantenimiento WHERE taller_rif = ?", [rif]);

    return result.rows;
  }

  static async create(mantenimiento) {
    const { vehiculo_mat, taller_rif, descripcion } = mantenimiento;

    const fecha = new Date().toISOString().slice(0, 10);

    try {
      const result = await turso.execute("INSERT INTO mantenimiento (vehiculo_mat, taller_rif, descripcion, fecha) VALUES (?, ?, ?, ?) RETURNING *;", [vehiculo_mat, taller_rif, descripcion, fecha ]);

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log(error);
      return { success: false }
    }
  }

  static async update(id, mantenimiento) {
    const { descripcion } = mantenimiento;

    try {
      await turso.execute("UPDATE mantenimiento SET descripcion = ? WHERE id = ?", [descripcion, id]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async delete(id) {
    try {
      await turso.execute("DELETE FROM mantenimiento WHERE id = ?", [id]);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
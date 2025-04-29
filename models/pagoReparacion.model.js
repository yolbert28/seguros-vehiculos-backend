import { turso } from "./connection/dbConnection.js";

export default class PagoReparacionModel {
  static async getAll() {
    const result = await turso.execute("SELECT pr.id, pr.reparacion_id, p.nombre as pagante, pr.monto, pr.fecha FROM pago_reparacion pr, pagante p  WHERE pr.pagante = p.id");

    return result.rows;
  }

  static async getById(id) {
    const result = await turso.execute("SELECT pr.id, pr.reparacion_id, p.nombre as pagante, pr.monto, pr.fecha FROM pago_reparacion pr, pagante p  WHERE pr.pagante = p.id AND pr.id = ?", [id]);

    return result.rows[0];
  }

  static async getByReparacion(reparacionId) {
    const result = await turso.execute("SELECT pr.id, pr.reparacion_id, p.nombre as pagante, pr.monto, pr.fecha FROM pago_reparacion pr, pagante p  WHERE pr.pagante = p.id AND reparacion_id = ?", [reparacionId]);

    return result.rows;
  }

  static async create(pagoReparacion) {
    const { reparacion_id, pagante, monto, fecha } = pagoReparacion;

    try {

      const result = await turso.execute(
        "INSERT INTO pago_reparacion (reparacion_id, pagante, monto, fecha) VALUES (?, ?, ?, ?) RETURNING *",
        [reparacion_id, pagante, monto, fecha]
      )

      return { success: true, data: result.rows[0] };
    } catch (e) {
      console.error(e);
      return { success: false }
    }
  }

  static async update(id, pagoReparacion) {
    const { pagante, monto, fecha } = pagoReparacion;

    try {

      await turso.execute(
        "UPDATE pago_reparacion SET pagante = ?, monto = ?, fecha = ? WHERE id = ?",
        [pagante, monto, fecha, id]
      )

      return true;
    } catch (e) {
      console.error(e);
      return false
    }
  }

  static async delete(id){
    try {
      await turso.execute("DELETE FROM pago_reparacion WHERE id = ?", [id]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
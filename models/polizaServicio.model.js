import { turso } from "./connection/dbConnection.js";

export default class PolizaServicioModel {

  static async getById(polizaId, servicioId) {
    const result = await turso.execute("SELECT * FROM poliza_servicio WHERE poliza_id = ? AND servicio_id = ?",
      [polizaId, servicioId]
    )

    return result.rows;
  }

  static async create(polizaServicio) {
    const { poliza_id, servicio_id } = polizaServicio;

    try {
      await turso.execute(
      "INSERT INTO poliza_servicio (poliza_id, servicio_id ) VALUES (?,?)",
      [poliza_id, servicio_id ]);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }

  }

  static async delete(polizaServicio) {

    const { poliza_id, servicio_id } = polizaServicio;
    try {
      await turso.execute(
        "DELETE FROM poliza_servicio WHERE poliza_id = ? AND servicio_id = ?",
        [poliza_id, servicio_id]
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
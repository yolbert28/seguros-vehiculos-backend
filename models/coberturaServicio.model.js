export default class CoberturaServicioModel {
  static async create(coberturaServicio) {

    const { cobertura_id, servicio_id } = coberturaServicio;

    try {
      await turso.execute(
      "INSERT INTO cobertura_servicio (cobertura_id, servicio_id ) VALUES (?,?)",
      [cobertura_id, servicio_id ]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async delete(cobertura_id, servicio_id){
    try {
      await turso.execute(
        "DELETE FROM cobertura_servicio WHERE cobertura_id = ? AND servicio_id = ?",
        [cobertura_id, servicio_id]
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
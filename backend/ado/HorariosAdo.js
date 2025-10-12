/**
 * Esta classe implementa os métodos da camada de persistência.
 *
 * @date 12/10/2025
 * @author Lis Peixoto
 */
import connect from "./ConexaoAdo.js";

class HorariosAdo {
  /**
   * Busca todos os horários disponíveis de um campus.
   * Ordena por horário inicial.
   * @param {number} campId Identificador do campus.
   * @param {function} callback Função callback.
   */

  static buscaTodosHorarios(callback) {
  const sql = `
    SELECT hora_camp_id AS horaCampId,
           hora_horario_inicial AS horaHorarioInicial,
           hora_horario_final AS horaHorarioFinal
      FROM Horarios
     WHERE hora_status_bd = 'V'
     ORDER BY hora_camp_id, hora_horario_inicial
  `;
  connect.query(sql, (error, results) => {
    callback(error, results);
  });
}

  static buscaHorariosAlocaveisDoCampus(campId, callback) {
    const sql = `
      SELECT hora_camp_id         AS horaCampId,
             hora_horario_inicial AS horaHorarioInicial,
             hora_horario_final   AS horaHorarioFinal
        FROM Horarios
       WHERE hora_camp_id = ?
         AND hora_status_bd = 'V'
         AND (
              hora_dt_inicial_indisponibilizado IS NULL
           OR hora_dt_inicial_indisponibilizado > CURDATE()
           OR (hora_dt_final_indisponibilizado IS NOT NULL
               AND hora_dt_final_indisponibilizado < CURDATE())
         )
       ORDER BY hora_horario_inicial
    `;

    const query = connect.query(sql, [campId], (error, results) => {
      callback(error, results);
    });

    console.log(query.sql);
  }

  /**
   * Busca os horários de um campus acima de um horário informado.
   * @param {number} campId Identificador do campus.
   * @param {string} horario Horário no formato "HH:MM:SS". Padrão "00:00:00".
   * @param {function} callback Função callback.
   */
  static buscaIntervaloDeHorarios(campId, horario = "00:00:00", callback) {
    const sql = `
      SELECT hora_camp_id         AS horaCampId,
             hora_horario_inicial AS horaHorarioInicial,
             hora_horario_final   AS horaHorarioFinal
        FROM Horarios
       WHERE hora_camp_id = ?
         AND hora_status_bd = 'V'
         AND (
              hora_dt_inicial_indisponibilizado IS NULL
           OR hora_dt_inicial_indisponibilizado > CURDATE()
           OR (hora_dt_final_indisponibilizado IS NOT NULL
               AND hora_dt_final_indisponibilizado < CURDATE())
         )
         AND hora_horario_final > ?
       ORDER BY hora_horario_inicial
    `;

    const query = connect.query(sql, [campId, horario], (error, results) => {
      callback(error, results);
    });

    console.log(query.sql);
  }

  /**
   * Insere um horário na tabela de Horarios.
   * @param {object} horario Objeto com os dados do horário.
   * @param {function} callback Função callback.
   */
  static save(horario, callback) {
    const sql = "INSERT INTO Horarios SET ?";

    const query = connect.query(sql, horario, (error, results) => {
      callback(error, results);
    });

    console.log(query.sql);
  }

  /**
   * Atualiza um horário na tabela de Horarios.
   * @param {object} horario Objeto com os dados do horário.
   * @param {function} callback Função callback.
   */
  static update(horario, callback) {
    const sql =
      "UPDATE Horarios SET ? WHERE hora_camp_id = ? AND hora_horario_inicial = ?";

    const { hora_camp_id, hora_horario_inicial } = horario;

    const query = connect.query(
      sql,
      [horario, hora_camp_id, hora_horario_inicial],
      (error, results) => {
        callback(error, results);
      }
    );

    console.log(query.sql);
  }

  /**
   * Deleta um horário na tabela de Horarios.
   * @param {number} horaCampId Identificador do campus.
   * @param {string} horaHorarioInicial Horário inicial do intervalo.
   * @param {function} callback Função callback.
   */
  static delete(horaCampId, horaHorarioInicial, callback) {
    const sql =
      "DELETE FROM Horarios WHERE hora_camp_id = ? AND hora_horario_inicial = ?";

    const query = connect.query(
      sql,
      [horaCampId, horaHorarioInicial],
      (error, results) => {
        callback(error, results);
      }
    );

    console.log(query.sql);
  }
}

export default HorariosAdo;

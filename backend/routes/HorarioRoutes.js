/**
 * Esta classe implementa as rotas para o recurso Horario.
 *
 * @date 12/10/2025
 * @author Lis Peixoto
 */
import express from "express";
import HorariosAdo from "../ado/HorariosAdo.js";

const router = express.Router();

// GET /horarios → todos os horários
router.get("/", (req, res) => {
  console.log("GET geral de horários");

  HorariosAdo.buscaTodosHorarios((error, results) => {
    if (error) {
      console.error("Erro ao buscar horários:", error);
      return res.status(500).json({ msg: "Erro ao buscar horários." });
    }
    return res.json({ msg: "Horários carregados com sucesso", horarios: results });
  });
});

// ROTAS POR CAMPUS
router
  .route("/:horaCampId")
  .get((req, res) => {
    console.log("GET horários por campus");

    const horaCampId = req.params.horaCampId;

    HorariosAdo.buscaIntervaloDeHorarios(horaCampId, "00:00:00", (error, results) => {
      if (error) {
        console.error("Ocorreu um erro: " + error);
        return res.status(500).json({
          msg: "Ocorreu algum problema ao tentar consultar o horário. Contate o administrador do sistema."
        });
      }

      if (results.length > 0) {
        return res.json({
          msg: "Horários consultados com sucesso.",
          recurso: results
        });
      } else {
        return res.status(404).json({ msg: "Nenhum horário encontrado para este campus." });
      }
    });
  })
  .delete((req, res) => {
    console.log("DELETE horário");

    const horaCampId = req.params.horaCampId;
    const horaHorarioInicial = req.query.horaHorarioInicial; // pegar horário inicial via query

    if (!horaHorarioInicial) {
      return res.status(400).json({ msg: "É necessário informar horaHorarioInicial para deletar." });
    }

    HorariosAdo.delete(horaCampId, horaHorarioInicial, (error, results) => {
      if (error) {
        console.error("Erro ao deletar horário: " + error);
        return res.status(500).json({
          msg: "Ocorreu algum problema ao tentar excluir o horário. Contate o administrador do sistema."
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: "Horário não encontrado." });
      }

      return res.json({ msg: "Horário excluído com sucesso!" });
    });
  });

// ROTAS GERAIS
router
  .route("/")
  .post((req, res) => {
    console.log("POST novo horário");

    const horario = {
      hora_camp_id: req.body.horaCampId,
      hora_horario_inicial: req.body.horaHorarioInicial,
      hora_horario_final: req.body.horaHorarioFinal
    };

    HorariosAdo.save(horario, (error) => {
      if (error) {
        console.error("Erro ao salvar horário: " + error);
        return res.status(500).json({
          msg: "Ocorreu algum problema ao tentar incluir o horário. Contate o administrador do sistema."
        });
      }

      return res.json({ msg: "Horário inserido com sucesso!" });
    });
  })
  .put((req, res) => {
    console.log("PUT editar horário");

    const horario = {
      hora_camp_id: req.body.horaCampId,
      hora_horario_inicial: req.body.horaHorarioInicial,
      hora_horario_final: req.body.horaHorarioFinal
    };

    HorariosAdo.update(horario, (error, results) => {
      if (error) {
        console.error("Erro ao atualizar horário: " + error);
        return res.status(500).json({
          msg: "Ocorreu algum problema ao tentar alterar o horário. Contate o administrador do sistema."
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: "Horário não encontrado." });
      }

      return res.json({ msg: "Horário alterado com sucesso!" });
    });
  });

export default router;

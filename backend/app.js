/**
 * Esta é a interface do usuário para gerenciar horários.
 *
 * @date 12/10/2025
 * @author Lis Peixoto
 */
import React, { useState, useEffect } from "react";

export default function AppLis() {
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horaHorarioInicial, setHoraHorarioInicial] = useState("");
  const [horaHorarioFinal, setHoraHorarioFinal] = useState("");
  const [campusId, setCampusId] = useState(1); // ID do campus fixo ou selecionável

  /**
   * Carrega os horários do backend ao montar o componente.
   */
  useEffect(() => {
    async function carregaHorarios() {
      try {
        const response = await fetch(`http://localhost:3000/horarios/${campusId}`);
        const data = await response.json();
        setHorarios(data); // Array de horários retornado pelo backend
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
      }
    }

    carregaHorarios();
  }, [campusId]);

  /**
   * Limpa os campos do formulário.
   * Também pode ser usado para resetar o formulário após uma ação.
   */
  const limparCampos = () => {
    setHorarioSelecionado("");
    setHoraHorarioInicial("");
    setHoraHorarioFinal("");
  };

  /**
   * Busca um horário específico baseado no horário inicial selecionado.
   * Popula os campos do formulário com os dados do horário encontrado.
   * Se não encontrado, exibe um alerta.
   */
  const buscarHorario = () => {
    const h = horarios.find((h) => h.horaHorarioInicial === horarioSelecionado);
    if (h) {
      setHoraHorarioInicial(h.horaHorarioInicial);
      setHoraHorarioFinal(h.horaHorarioFinal);
      console.log("Horario carregado:", h);
    } else {
      alert("Horário não encontrado.");
    }
  };

  /**
   * Adiciona um novo horário chamando o backend.
   */
  const adicionarHorario = async () => {
    try {
      const response = await fetch("http://localhost:3000/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horaCampId: campusId,
          horaHorarioInicial,
          horaHorarioFinal
        })
      });
      const data = await response.json();
      console.log("Adicionado:", data);

      // Atualiza lista localmente
      setHorarios([...horarios, { horaCampId: campusId, horaHorarioInicial, horaHorarioFinal }]);
      limparCampos();
    } catch (error) {
      console.error("Erro ao adicionar horário:", error);
    }
  };

  /**
   * Edita um horário existente chamando o backend.
   */
  const editarHorario = async () => {
    try {
      const response = await fetch("http://localhost:3000/horarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horaCampId: campusId,
          horaHorarioInicial,
          horaHorarioFinal
        })
      });
      const data = await response.json();
      console.log("Editado:", data);

      // Atualiza lista localmente
      setHorarios(
        horarios.map((h) =>
          h.horaHorarioInicial === horarioSelecionado
            ? { ...h, horaHorarioInicial, horaHorarioFinal }
            : h
        )
      );
      limparCampos();
    } catch (error) {
      console.error("Erro ao editar horário:", error);
    }
  };

  /**
   * Exclui um horário chamando o backend.
   */
  const excluirHorario = async () => {
    try {
      const response = await fetch(`http://localhost:3000/horarios/${campusId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      console.log("Excluído:", data);

      setHorarios(horarios.filter((h) => h.horaHorarioInicial !== horarioSelecionado));
      limparCampos();
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
    }
  };

  return (
    <main className="principal p-4">
      <h1>Horários</h1>

      {/* Mensagens */}
      <p className="msg msg_ok">Este é um exemplo de mensagem ok.</p>
      <p className="msg msg_erro">Ano ou semestre do período letivo não encontrado.</p>
      <p className="msg msg_alerta">
        Os campos precedidos de *(asterisco) são obrigatórios!
      </p>

      {/* Seção de consulta */}
      <section className="w3-bar w3-light-grey p-2 mb-4">
        <select
          value={horarioSelecionado}
          onChange={(e) => setHorarioSelecionado(e.target.value)}
        >
          <option value="">Selecione um horário</option>
          {horarios.map((h) => (
            <option key={h.horaHorarioInicial} value={h.horaHorarioInicial}>
              {h.horaHorarioInicial} - {h.horaHorarioFinal}
            </option>
          ))}
        </select>
        <button className="ml-2" onClick={buscarHorario}>
          Buscar
        </button>
      </section>

      {/* Seção de inclusão/edição */}
      <section className="p-2 border rounded">
        <div className="mb-2">
          <label>Horário Inicial*</label>
          <input
            type="time"
            value={horaHorarioInicial}
            onChange={(e) => setHoraHorarioInicial(e.target.value)}
            className="w-full border p-1"
          />
        </div>

        <div className="mb-2">
          <label>Horário Final*</label>
          <input
            type="time"
            value={horaHorarioFinal}
            onChange={(e) => setHoraHorarioFinal(e.target.value)}
            className="w-full border p-1"
          />
        </div>

        <div className="mt-2">
          <button className="mr-2" onClick={limparCampos}>
            Limpar
          </button>
          <button className="mr-2" onClick={adicionarHorario}>
            Adicionar
          </button>
          <button className="mr-2" onClick={editarHorario}>
            Editar
          </button>
          <button onClick={excluirHorario}>Excluir</button>
        </div>
      </section>

      {/* Horários selecionados */}
      <section className="mt-4">
        <div id="horarios_selecionados">
          {horarios.map((h) => (
            <p key={h.horaHorarioInicial}>
              {h.horaHorarioInicial} - {h.horaHorarioFinal}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}

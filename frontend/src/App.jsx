import { useState, useEffect } from "react";
import "./App.css";

export default function AppHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [horaInicial, setHoraInicial] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  const [campusId, setCampusId] = useState(1); // pode ser selecionável

  // Carrega horários do backend
  useEffect(() => {
    fetch(`http://localhost:3000/horarios/${campusId}`)
      .then((res) => res.json())
      .then((data) => setHorarios(data.recurso || []))
      .catch((err) => console.error("Erro ao carregar horários:", err));
  }, [campusId]);

  // Limpa o formulário
  const limparCampos = () => {
    setHorarioSelecionado("");
    setHoraInicial("");
    setHoraFinal("");
  };

  // Preenche o form com o horário selecionado
  const SelecionarHorario = () => {
    if (!horarioSelecionado) return; // não faz nada se for a opção padrão

    const h = horarios.find((h) => h.horaHorarioInicial === horarioSelecionado);
    if (h) {
      setHoraInicial(h.horaHorarioInicial);
      setHoraFinal(h.horaHorarioFinal);
    } else {
      alert("Horário não encontrado.");
    }
  };

  // Adiciona novo horário
  const adicionarHorario = async () => {
    if (!horaInicial || !horaFinal) return alert("Preencha todos os campos");
    try {
      await fetch("http://localhost:3000/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horaCampId: campusId,
          horaHorarioInicial: horaInicial,
          horaHorarioFinal: horaFinal,
        }),
      });
      setHorarios([
        ...horarios,
        {
          horaCampId: campusId,
          horaHorarioInicial: horaInicial,
          horaHorarioFinal: horaFinal,
        },
      ]);
      limparCampos();
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  };

  // Edita horário existente
  const editarHorario = async () => {
    if (!horarioSelecionado) return alert("Selecione um horário");
    try {
      await fetch("http://localhost:3000/horarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horaCampId: campusId,
          horaHorarioInicial: horaInicial,
          horaHorarioFinal: horaFinal,
        }),
      });
      setHorarios(
        horarios.map((h) =>
          h.horaHorarioInicial === horarioSelecionado
            ? {
                ...h,
                horaHorarioInicial: horaInicial,
                horaHorarioFinal: horaFinal,
              }
            : h
        )
      );
      limparCampos();
    } catch (err) {
      console.error("Erro ao editar:", err);
    }
  };

  // Remove horário
  const excluirHorario = async () => {
    if (!horarioSelecionado) return alert("Selecione um horário");
    try {
      await fetch(
        `http://localhost:3000/horarios/${campusId}?horaHorarioInicial=${horarioSelecionado}`,
        {
          method: "DELETE",
        }
      );
      setHorarios(
        horarios.filter((h) => h.horaHorarioInicial !== horarioSelecionado)
      );
      limparCampos();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <main className="principal">
      <h1>Gerenciar Horários</h1>

      {/* Seção de seleção */}
      <section className="selecao">
        <select
          value={horarioSelecionado}
          onChange={(e) => {
            const valor = e.target.value; // pega o valor selecionado
            setHorarioSelecionado(valor); // atualiza o state
            if (valor) {
              // só preenche se não for a opção padrão
              const h = horarios.find((h) => h.horaHorarioInicial === valor);
              if (h) {
                setHoraInicial(h.horaHorarioInicial);
                setHoraFinal(h.horaHorarioFinal);
              }
            } else {
              // se selecionar a primeira opção, limpa o form
              setHoraInicial("");
              setHoraFinal("");
            }
          }}
        >
          <option value="">Selecione um horário</option>
          {horarios.map((h) => (
            <option key={h.horaHorarioInicial} value={h.horaHorarioInicial}>
              {h.horaHorarioInicial} - {h.horaHorarioFinal}
            </option>
          ))}
        </select>
      </section>

      {/* Formulário para adicionar/editar */}
      <section className="formularioHorarios">
        <div className="Info">
          <label>Horário Inicial*</label>
          <input
            type="time"
            value={horaInicial}
            onChange={(e) => setHoraInicial(e.target.value)}
          />
           <label>Horário Final*</label>
          <input
            type="time"
            value={horaFinal}
            onChange={(e) => setHoraFinal(e.target.value)}
          />
        </div>
        <div className="botoes">
          <button onClick={limparCampos}>Limpar</button>
          <button onClick={adicionarHorario}>Adicionar</button>
          <button onClick={editarHorario}>Editar</button>
          <button onClick={excluirHorario}>Excluir</button>
        </div>
      </section>

      {/* Lista de horários
      <section className="lista">
        {horarios.map((h) => (
          <p key={h.horaHorarioInicial}>
            {h.horaHorarioInicial} - {h.horaHorarioFinal}
          </p>
        ))}
      </section> */}
    </main>
  );
}

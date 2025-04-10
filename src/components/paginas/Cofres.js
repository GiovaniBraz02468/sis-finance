// pages/Cofres.js
import React, { useEffect, useState } from "react";
import { getCofres, criarCofre, excluirCofre } from "../services/CofreService";
import { supabase } from "../services/supabase";
import CardCofre from "../CardCofre";
import ModalMovimentoCofre from "../ModalMovimentoCofre";
import ModalHistoricoCofre from "../ModalHistoricoCofre";
import { FaPlus, FaMinus, FaEye, FaTrash } from "react-icons/fa";

function Cofres() {
  const [userId, setUserId] = useState(null);
  const [cofres, setCofres] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [nomeCofre, setNomeCofre] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cofreSelecionado, setCofreSelecionado] = useState(null);
  const [tipoMovimento, setTipoMovimento] = useState("add");
  const [modalHistoricoVisible, setModalHistoricoVisible] = useState(false);
  const [cofreHistorico, setCofreHistorico] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        carregarCofres(user.id);
      }
    };
    fetchUser();
  }, []);

  const carregarCofres = async (id) => {
    const lista = await getCofres(id);
    setCofres(lista);
  };

  const handleSalvarCofre = async () => {
    if (!nomeCofre.trim()) return;
    await criarCofre(userId, nomeCofre.trim().toUpperCase());
    setNomeCofre("");
    setShowInput(false);
    carregarCofres(userId);
  };

  const handleCancelar = () => {
    setNomeCofre("");
    setShowInput(false);
  };

  const abrirModalMovimento = (cofre, tipo) => {
    setCofreSelecionado(cofre);
    setTipoMovimento(tipo);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setCofreSelecionado(null);
    carregarCofres(userId);
  };

  const abrirHistorico = (cofre) => {
    setCofreHistorico(cofre);
    setModalHistoricoVisible(true);
  };

  const confirmarExclusaoCofre = async (cofre) => {
    const confirmar = window.confirm(
      `Deseja mesmo excluir o cofre "${cofre.Nome}"?\nTodos os movimentos associados a ele também serão excluídos.`
    );

    if (!confirmar) return;

    try {
      await excluirCofre(cofre.Id, userId); // 👈 certifique-se disso
      carregarCofres(userId);
    } catch (error) {
      console.error("Erro ao excluir cofre:", error);
      alert("Erro ao excluir cofre: " + (error.message || JSON.stringify(error)));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Cofres</h3>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-dark mb-3"
          onClick={() => setShowInput(true)}
          disabled={showInput}
        >
          Adicionar Novo Cofre
        </button>
      </div>

      {showInput && (
        <div className="d-flex justify-content-center">
          <div className="d-flex gap-2 w-100" style={{ maxWidth: 500 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Nome do Cofre"
              value={nomeCofre}
              onChange={(e) => setNomeCofre(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSalvarCofre}>
              Salvar
            </button>
            <button className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        {cofres.map((cofre) => (
          <CardCofre
            key={cofre.Id}
            nome={cofre.Nome}
            valor={cofre.Valor}
            onAdd={() => abrirModalMovimento(cofre, "add")}
            onSub={() => abrirModalMovimento(cofre, "sub")}
            onView={() => abrirHistorico(cofre)}
            onDelete={() => confirmarExclusaoCofre(cofre)}
            icons={{
              add: <FaPlus />,
              sub: <FaMinus />,
              view: <FaEye />,
              delete: <FaTrash />
            }}
          />
        ))}
      </div>

      {cofreSelecionado && (
        <ModalMovimentoCofre
          show={modalVisible}
          handleClose={fecharModal}
          cofre={cofreSelecionado}
          isSub={tipoMovimento === "sub"}
        />
      )}

      {cofreHistorico && (
        <ModalHistoricoCofre
          show={modalHistoricoVisible}
          handleClose={() => {
            setModalHistoricoVisible(false);
            carregarCofres(userId); // <- atualiza os valores dos cofres!
          }}
          cofre={cofreHistorico}
          userId={userId}
        />
      )}
    </div>
  );
}

export default Cofres;
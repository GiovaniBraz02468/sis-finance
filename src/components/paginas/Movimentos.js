import React, { useState, useEffect } from 'react';
import Titulo from "../Titulo";
import Lista from '../Lista';
import ModalCadastro from '../ModalCadastro';
import { buscarMovimentos } from '../services/movimentoService';
import { supabase } from "../services/supabase";
import "./Movimentos.css";

function Movimentos() {
  const [selectedOption, setSelectedOption] = useState('resumo');
  const [showFilter, setShowFilter] = useState(false);
  const [movimentos, setMovimentos] = useState([]);
  const [movimentosFiltrados, setMovimentosFiltrados] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('');

  const today = new Date();
  const [month, setMonth] = useState(String(today.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(today.getFullYear()));

  const showTipo = selectedOption === 'resumo';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const carregarMovimentos = async () => {
    if (!userId) return;
    try {
      const data = await buscarMovimentos(userId, month, year);
      setMovimentos(data);
    } catch (error) {
      console.error("Erro ao carregar os movimentos:", error);
    }
  };

  useEffect(() => {
    carregarMovimentos();
  }, [userId, month, year]);

  useEffect(() => {
    if (selectedOption === "resumo") {
      setMovimentosFiltrados(movimentos);
    } else if (selectedOption === "receita") {
      setMovimentosFiltrados(movimentos.filter(m => m.Tipo === 1));
    } else if (selectedOption === "gasto") {
      setMovimentosFiltrados(movimentos.filter(m => m.Tipo === 2));
    }
  }, [selectedOption, movimentos]);

  const handleNovaReceita = () => {
    setTipoModal('Receita');
    setShowModal(true);
  };

  const handleNovoGasto = () => {
    setTipoModal('Gasto');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    carregarMovimentos(); // Recarrega os dados após adicionar novo movimento
  };

  return (
    <div className="movimentos-container">
      <Titulo titulo="Movimentos" />

      <div className="d-flex justify-content-center my-3">
        <button className="btn btn-dark" onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? 'Fechar Filtro' : 'Abrir Filtro'}
        </button>
      </div>

      {showFilter && (
        <div className="filter-container p-3 border rounded mb-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Mês</label>
              <input
                type="number"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="MM"
                min="1"
                max="12"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Ano</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="YYYY"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="btn-group d-flex justify-content-center" role="group">
        {['resumo', 'receita', 'gasto'].map((tipo) => (
          <React.Fragment key={tipo}>
            <input
              type="radio"
              className="btn-check"
              name="options-base"
              id={`option-${tipo}`}
              autoComplete="off"
              checked={selectedOption === tipo}
              onChange={() => setSelectedOption(tipo)}
            />
            <label
              className={`btn border ${selectedOption === tipo
                ? tipo === 'resumo'
                  ? 'btn-dark text-white'
                  : tipo === 'receita'
                    ? 'btn-success text-white'
                    : 'btn-danger text-white'
                : `btn-outline-${tipo === 'resumo' ? 'dark' : tipo}`
                }`}
              htmlFor={`option-${tipo}`}
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Botões Nova Receita / Gasto */}
      <div className="d-flex justify-content-center gap-2 my-3">
        {(selectedOption === 'resumo' || selectedOption === 'receita') && (
          <button className="btn btn-success" onClick={handleNovaReceita}>
            Nova Receita
          </button>
        )}
        {(selectedOption === 'resumo' || selectedOption === 'gasto') && (
          <button className="btn btn-danger" onClick={handleNovoGasto}>
            Novo Gasto
          </button>
        )}
      </div>

      <div className="lista-scroll-container">
        <Lista titulo={selectedOption} showTipo={showTipo} dados={movimentosFiltrados} onAtualizado={carregarMovimentos} />
      </div>

      <ModalCadastro
        show={showModal}
        handleClose={handleCloseModal}
        tipo={tipoModal}
      />
    </div>
  );
}

export default Movimentos;
import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import ModalEditar from './ModalEditar'

function Lista({ titulo, showTipo, dados, onAtualizado }) {

  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);

  const handleAbrirModal = (item) => {
    setMovimentoSelecionado(item);
  };

  const handleFecharModal = () => {
    setMovimentoSelecionado(null);
  };

  const formatarValor = (valor) => {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarData = (data) => {
    const d = new Date(data);
    const dia = d.getUTCDate().toString().padStart(2, '0');
    const mes = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = d.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Calcular o valor total conforme o tipo selecionado
  const calcularTotal = () => {
    if (titulo === 'resumo') {
      const totalReceitas = dados
        .filter(item => item.Tipo === 1)
        .reduce((acc, cur) => acc + Number(cur.Valor), 0);
      const totalGastos = dados
        .filter(item => item.Tipo === 2)
        .reduce((acc, cur) => acc + Number(cur.Valor), 0);
      return totalReceitas - totalGastos;
    } else {
      const tipo = titulo === 'receita' ? 1 : 2;
      return dados
        .filter(item => item.Tipo === tipo)
        .reduce((acc, cur) => acc + Number(cur.Valor), 0);
    }
  };

  const total = calcularTotal();

  // Define a cor conforme as regras
  const getTotalClass = () => {
    if (titulo === 'resumo') {
      return total >= 0 ? 'text-success' : 'text-danger';
    } else if (titulo === 'receita') {
      return 'text-success';
    } else if (titulo === 'gasto') {
      return 'text-danger';
    }
    return '';
  };

  return (
    <div className="lista-movimentos mt-4">
      <div className="text-center mb-3">
        <h4>
          Total: <span className={getTotalClass()}>{formatarValor(total)}</span>
        </h4>
      </div>

      {dados.length === 0 ? (
        <p className="text-center text-muted">Nenhum movimento encontrado.</p>
      ) : (
        <ul className="list-group">
          {dados.map((item) => (
            <li
              key={item.Id}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => handleAbrirModal(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <div>
                  <div className="fw-bold">{item.Descricao}</div>
                  <small className="text-muted">{formatarData(item.Data)}</small>
                </div>
              </div>
              <div className="text-end">
                <span
                  className={`fw-bold ${item.Tipo === 2 ? 'text-danger' : 'text-success'}`}
                >
                  {formatarValor(item.Valor)}
                </span>
                {showTipo && (
                  <div>
                    <span className={`badge ${item.Tipo === 1 ? 'bg-success' : 'bg-danger'}`}>
                      {item.Tipo === 1 ? 'Receita' : 'Gasto'}
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {movimentoSelecionado && (
        <ModalEditar
          show={!!movimentoSelecionado}
          handleClose={handleFecharModal}
          movimento={movimentoSelecionado}
          onAtualizado={onAtualizado}
        />
      )}
    </div>
  );
}

export default Lista;
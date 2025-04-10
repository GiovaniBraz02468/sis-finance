// components/CardCofre.js
import React from "react";

function CardCofre({ nome, valor, onAdd, onSub, onView, onDelete }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">{nome}</h5>
          <p className="mb-0 fw-bold">R$ {parseFloat(valor).toFixed(2)}</p>
        </div>
        <div className="btn-group d-flex justify-content-center mt-3" role="group">
          <button className="btn btn-outline-primary btn-sm" title="Adicionar" onClick={onAdd}>
            <i className="bi bi-plus-lg"></i>
          </button>
          <button className="btn btn-outline-danger btn-sm" title="Remover" onClick={onSub}>
            <i className="bi bi-dash-lg"></i>
          </button>
          <button className="btn btn-outline-warning btn-sm" title="Histórico" onClick={onView}>
            <i className="bi bi-eye"></i>
          </button>
          <button className="btn btn-outline-dark btn-sm" title="Excluir Cofre" onClick={onDelete}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardCofre;

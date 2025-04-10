import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";
import ModalCadastro from "./ModalCadastro";

function Cards({onAdicionar}) {
  const [showModal, setShowModal] = useState(false);
  const [tipo, setTipo] = useState("");

  const handleShow = (tipo) => {
    setTipo(tipo);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    if (onAdicionar) {
      onAdicionar(); // Chama a função passada pelo Dashboard
    }
  };

  return (
    <>
      <div className="card-container">
        <div className="card cardCar text-bg-success mb-3">
          <div className="card-header text-center">Receita</div>
          <div className="card-body text-center">
            <button type="button" className="btn btn-light" onClick={() => handleShow("Receita")}>
              Adicionar
            </button>
          </div>
        </div>

        <div className="card cardCar text-bg-danger mb-3">
          <div className="card-header text-center">Gasto</div>
          <div className="card-body text-center">
            <button type="button" className="btn btn-light" onClick={() => handleShow("Gasto")}>
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <ModalCadastro
        show={showModal}
        handleClose={handleClose}
        tipo={tipo}
      />
    </>
  );
}

export default Cards;

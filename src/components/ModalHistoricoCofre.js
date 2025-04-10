import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { supabase } from "./services/supabase";
import { excluirMovimento } from "./services/movimentoService";

function ModalHistoricoCofre({ show, handleClose, cofre, userId }) {
  const [movimentos, setMovimentos] = useState([]);

  useEffect(() => {
    if (cofre && show) {
      buscarMovimentosCofre();
    }
  }, [cofre, show]);

  const buscarMovimentosCofre = async () => {
    const { data, error } = await supabase
      .from("Movimento")
      .select("Id_mov, Data, Valor")
      .eq("Id_usuario", userId)
      .eq("Tipo", 3)
      .eq("Cofre_Id", cofre.Id)
      .eq("Cofre_User", userId)
      .order("Data", { ascending: false });

    if (!error) setMovimentos(data);
  };

  const handleExcluir = async (movimento) => {
    const confirmar = window.confirm("Deseja mesmo excluir este movimento?");
    if (!confirmar) return;

    try {
      await excluirMovimento(movimento.Id_mov, userId);
      setMovimentos((prev) => prev.filter((m) => m.Id_mov !== movimento.Id_mov));
    } catch (error) {
      alert("Erro ao excluir o movimento.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{cofre?.Nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {movimentos.length === 0 ? (
          <p className="text-center">Nenhum movimento encontrado.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Data</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentos.map((mov) => (
                <tr key={mov.Id_mov}>
                  <td>{new Date(mov.Data).toLocaleDateString()}</td>
                  <td>{mov.Valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleExcluir(mov)}>
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalHistoricoCofre;
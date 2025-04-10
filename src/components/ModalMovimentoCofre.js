import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { adicionarMovimentoCofre } from "./services/movimentoService";
import { supabase } from "./services/supabase";
import { useAuth } from "./services/AuthContext";

function ModalMovimentoCofre({ show, handleClose, cofre, isSub }) {
  const { user } = useAuth();
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];
    setData(hoje);
  }, [show]);

  const formatarValor = (valor) => {
    let num = valor.replace(/\D/g, "");
    if (num === "") return "";
    return (parseInt(num, 10) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  const converterParaNumero = (valor) => {
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  };

  const handleSubmit = async () => {
    if (!valor || !data) {
      alert("Preencha todos os campos.");
      return;
    }

    const valorFinal = converterParaNumero(valor) * (isSub ? -1 : 1);

    const novoMov = {
      Id_usuario: user.id,
      Tipo: 3,
      Data: data,
      Valor: valorFinal,
      Id_cofre: cofre.Id,
    };

    try {
      await adicionarMovimentoCofre(user.id, cofre.Id, valorFinal, data);
      handleClose();
      setValor("");
    } catch (error) {
      alert("Erro ao adicionar o movimento.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isSub ? "Remover do Cofre" : "Adicionar ao Cofre"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Valor</Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(formatarValor(e.target.value))}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </Form.Group>

          <Button
            variant={isSub ? "danger" : "primary"}
            className="w-100"
            onClick={handleSubmit}
          >
            {isSub ? "Remover" : "Adicionar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalMovimentoCofre;
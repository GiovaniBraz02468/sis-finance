import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { supabase } from "./services/supabase";
import { atualizarMovimento, excluirMovimento } from "./services/movimentoService";

function ModalEditar({ show, handleClose, movimento, onAtualizado }) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState(1);

  useEffect(() => {
    if (movimento) {
      setValor(formatarValor(String(movimento.Valor)));
      setDescricao(movimento.Descricao || "");
      setData(movimento.Data.split("T")[0]);
      setTipo(movimento.Tipo);
    }
  }, [movimento]);

  const formatarValor = (valor) => {
    let num = valor.replace(/\D/g, "");
    if (num === "") return "";
    return (parseInt(num, 10) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  };

  const converterValorParaNumero = (valor) => {
    return parseFloat(valor.replace(/\./g, "").replace(",", "."));
  };

  const handleChange = (e) => {
    setValor(formatarValor(e.target.value));
  };

  const handleAtualizar = async () => {
    try {
      await atualizarMovimento({
        Id_mov: movimento.Id_mov,
        Id_usuario: movimento.Id_usuario,
        Valor: converterValorParaNumero(valor),
        Descricao: descricao,
        Data: data,
        Tipo: tipo
      });
      handleClose();
      onAtualizado();
    } catch {
      alert("Erro ao atualizar movimento.");
    }
  };

  const handleExcluir = async () => {
    try {
      await excluirMovimento(movimento.Id_mov, movimento.Id_usuario);
      handleClose();
      onAtualizado();
    } catch {
      alert("Erro ao excluir movimento.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Movimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Valor</Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                type="text"
                value={valor}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="0,00"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Salário, Mercado..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Tipo</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Receita"
                name="tipo"
                id="tipo-receita"
                value={1}
                checked={tipo === 1}
                onChange={() => setTipo(1)}
              />
              <Form.Check
                inline
                type="radio"
                label="Gasto"
                name="tipo"
                id="tipo-gasto"
                value={2}
                checked={tipo === 2}
                onChange={() => setTipo(2)}
              />
            </div>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="danger" className="w-50" onClick={handleExcluir}>
              Excluir
            </Button>
            <Button variant="primary" className="w-50" onClick={handleAtualizar}>
              Atualizar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalEditar;
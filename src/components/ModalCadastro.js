import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Toast, ToastContainer } from "react-bootstrap";
import { addMovimento } from "./services/movimentoService";
import { useAuth } from "./services/AuthContext";

function ModalCadastro({ show, handleClose, tipo }) {
  const { user } = useAuth();
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isCofre, setIsCofre] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setData(today);
  }, [show]); // Atualiza a data toda vez que o modal for aberto

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

  const handleSubmit = async () => {
    if (!valor || !descricao || !data) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const novoMovimento = {
        Id_usuario: user.id,
        Tipo: tipo === "Receita" ? 1 : tipo === "Gasto" ? 2 : 3,
        Data: data,
        Valor: converterValorParaNumero(valor),
        Descricao: descricao,
      };

      await addMovimento(novoMovimento);

      if (isCofre) {
        const movimentoCofre = {
          ...novoMovimento,
          Tipo: 3, // Tipo cofre
        };
        await addMovimento(movimentoCofre);
      }

      setShowToast(true);
      setValor("");
      setDescricao("");
      setIsCofre(false);

      setTimeout(() => {
        setShowToast(false);
        handleClose(); // Fecha o modal após o Toast
      }, 1500);
    } catch (error) {
      alert("Erro ao adicionar movimento. Tente novamente.");
    }
  };

  return (
    <>
      <ToastContainer position="top-end" className="p-3">
        <Toast
          className="shadow"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Movimento adicionado!</strong>
          </Toast.Header>
          <Toast.Body style={{ backgroundColor: "#fff", color: "#000" }}>
            O {tipo.toLowerCase()} foi registrado com sucesso.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar {tipo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Digite o valor</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={valor}
                  onChange={handleChange}
                  placeholder="0,00"
                  inputMode="numeric"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição (Opcional)</Form.Label>
              <Form.Control
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Salário, Conta de Luz..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Selecionar data</Form.Label>
              <Form.Control
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </Form.Group>

            {tipo === "Gasto" && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Adicionar ao Cofre"
                  checked={isCofre}
                  onChange={(e) => setIsCofre(e.target.checked)}
                />
              </Form.Group>
            )}

            <Button variant="primary" className="w-100" onClick={handleSubmit}>
              Adicionar {tipo}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalCadastro;
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { cadastrarUsuario } from "./services/usuarioService";

function ModalCadastroUsuario({ show, onClose, userId, onSuccess }) {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!nome.trim() || !sobrenome.trim()) {
      setError("Nome e Sobrenome são obrigatórios.");
      return;
    }
    
    try {
      await cadastrarUsuario(userId, nome, sobrenome);
      onClose(); // Fecha o modal após cadastro
      onSuccess(); // Libera o acesso
    } catch (err) {
      setError("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Complete seu cadastro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Cadastrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCadastroUsuario;
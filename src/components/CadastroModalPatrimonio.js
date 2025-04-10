import { useState } from "react";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { adicionarPatrimonio } from "./services/patrimonioService";

function ModalCadastroPatrimonio({ show, onHide }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const handleSalvar = async () => {
    const valorFormatado = parseFloat(valor.replace(/\./g, "").replace(",", "."));

    if (!nome.trim() || !descricao.trim() || !valor) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    await adicionarPatrimonio({ nome, descricao, valor: valorFormatado });

    setNome("");
    setDescricao("");
    setValor("");
    onHide();
  };

  const formatarValor = (valor) => {
    let num = valor.replace(/\D/g, "");
    if (num === "") return "";
    return (parseInt(num, 10) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
  };

  const handleChangeValor = (e) => {
    const somenteNumeros = e.target.value.replace(/\D/g, "");
    const valorFormatado = formatarValor(somenteNumeros);
    setValor(valorFormatado);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Novo Patrimônio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Carro, Casa..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes do item"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valor</Form.Label>
            <InputGroup>
              <InputGroup.Text>R$</InputGroup.Text>
              <Form.Control
                type="text"
                value={valor}
                onChange={handleChangeValor}
                inputMode="numeric"
                placeholder="0,00"
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          <Col>
            <Button variant="danger" onClick={onHide} className="w-100">
              Cancelar
            </Button>
          </Col>
          <Col>
            <Button variant="success" onClick={handleSalvar} className="w-100">
              Salvar
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCadastroPatrimonio;
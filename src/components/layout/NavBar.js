import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useAuth } from "../services/AuthContext";
import { supabase } from "../services/supabase";
import {
  verificarUsuario,
  atualizarUsuario,
  criarUsuario
} from "../services/usuarioService";

function NavBar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [usuarioExiste, setUsuarioExiste] = useState(false);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [showPerfil, setShowPerfil] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (showPerfil && user) {
      buscarPerfil();
    }
  }, [showPerfil]);

  const buscarPerfil = async () => {
    const dados = await verificarUsuario(user.id);
    if (dados) {
      setUsuarioExiste(true);
      setNome(dados.Nome);
      setSobrenome(dados.Sobrenome);
    } else {
      setUsuarioExiste(false);
      setNome("");
      setSobrenome("");
    }
  };

  const handleSalvarPerfil = async () => {
    if (!nome || !sobrenome) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      if (usuarioExiste) {
        await atualizarUsuario(user.id, { Nome: nome, Sobrenome: sobrenome });
      } else {
        await criarUsuario({ Id: user.id, Nome: nome, Sobrenome: sobrenome });
      }
      setShowPerfil(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil");
    }
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">SisFinance</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/movimentos">Movimentos</Nav.Link>
              <Nav.Link as={Link} to="/cofres">Cofres</Nav.Link>
              <Nav.Link as={Link} to="/patrimonio">Patrimônio</Nav.Link>
            </Nav>
            <Nav className="gap-2">
              <Button variant="outline-primary" onClick={() => setShowPerfil(true)}>
                Perfil
              </Button>
              <Button variant="outline-danger" onClick={() => setShowConfirmLogout(true)}>
                Sair
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal Perfil */}
      <Modal show={showPerfil} onHide={() => setShowPerfil(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value.replace(/\s/g, ""))}
                placeholder="Digite seu nome"
                required
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Sobrenome</Form.Label>
              <Form.Control
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value.replace(/\s/g, ""))}
                placeholder="Digite seu sobrenome"
                required
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowPerfil(false)}>
            Fechar
          </Button>
          <Button variant="success" onClick={handleSalvarPerfil}>
            {usuarioExiste ? "Atualizar" : "Salvar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmação de Logout */}
      <Modal show={showConfirmLogout} onHide={() => setShowConfirmLogout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja sair?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmLogout(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Sair
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NavBar;
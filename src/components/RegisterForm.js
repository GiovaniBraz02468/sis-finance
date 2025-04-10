import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./services/supabase";
import { useAuth } from "../components/services/AuthContext";

function RegisterForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("O email é obrigatório.");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Cria o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (!user || !user.id) {
        alert("Erro ao obter informações do usuário após cadastro.");
        return;
      }

      // Login automático
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (loginError) {
        alert("Conta criada, mas erro ao logar. Faça login manualmente.");
        navigate("/");
        return;
      }

      setUser(loginData.user);
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Senha</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button variant="outline-secondary" onClick={togglePassword} type="button">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirmar Senha</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <Button variant="outline-secondary" onClick={toggleConfirmPassword} type="button">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Button variant="success" type="submit" className="w-100" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>

      <div className="text-center mt-3">
        <Button variant="link" onClick={toggleForm}>
          Já tenho conta
        </Button>
      </div>
    </Form>
  );
}

export default RegisterForm;
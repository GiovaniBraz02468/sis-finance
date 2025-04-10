import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../components/services/supabase";
import { useAuth } from "../components/services/AuthContext";

function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setUser(data.user);
      navigate("/dashboard");

    } catch (error) {
      alert("Erro ao tentar fazer login. Tente novamente.");
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
          <Button variant="outline-secondary" onClick={togglePassword}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Entrar
      </Button>

      <div className="text-center mt-3">
        <Button variant="link" onClick={toggleForm}>
          Não tenho conta
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;

import { useState } from "react";
import { Card } from "react-bootstrap";
import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <h3 className="text-center">{isLogin ? "Login" : "Cadastro"}</h3>
        {isLogin ? <LoginForm toggleForm={() => setIsLogin(false)} /> : <RegisterForm toggleForm={() => setIsLogin(true)} />}
      </Card>
    </div>
  );
}

export default Login;

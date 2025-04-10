import "./Dashboard.css";
import Titulo from "../Titulo";
import Cards from "../Card";
import CardResumo from "../CardResumo";
import { useAuth } from "../services/AuthContext";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "react-bootstrap";

function Dashboard() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [atualizarResumo, setAtualizarResumo] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const handleAdicionarMovimento = () => {
    setAtualizarResumo(prev => !prev); // muda o estado para forçar reload no CardResumo
  };

  if (!user) return null;

  return (
    <>
      <Titulo titulo="Dashboard" />
      <br />
      <CardResumo atualizar={atualizarResumo} />
      <br />
      <h4>Adicionar um novo:</h4>
      <Cards onAdicionar={handleAdicionarMovimento} />
    </>
  );
}

export default Dashboard;

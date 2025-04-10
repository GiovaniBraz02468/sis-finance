import { useEffect, useState } from "react";
import { useAuth } from "./services/AuthContext";
import { buscarMovimentos } from "./services/movimentoService";
import "./CardResumo.css";

function CardResumo({atualizar}) {
  const [receitas, setReceitas] = useState(0);
  const [gastos, setGastos] = useState(0);
  const { user } = useAuth();

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());

  useEffect(() => {
    const carregarResumo = async () => {
        if (!user) return;
        try {
          const movimentos = await buscarMovimentos(user.id, month, year);
          const totalReceitas = movimentos.filter(m => m.Tipo === 1).reduce((acc, cur) => acc + cur.Valor, 0);
          const totalGastos = movimentos.filter(m => m.Tipo === 2).reduce((acc, cur) => acc + cur.Valor, 0);
    
          setReceitas(totalReceitas);
          setGastos(totalGastos);
        } catch (error) {
          console.error("Erro ao carregar resumo:", error);
        }
      };
    carregarResumo();
  }, [user, month, year, atualizar]);

  const formatarValor = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="row">
      <div className="col-sm-12 col-lg-4 mb-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">Mês atual</h5>
            <p className="card-text text-center">{formatarValor(receitas - gastos)}</p>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-lg-4 mb-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">Receita</h5>
            <p className="card-text text-center">{formatarValor(receitas)}</p>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-lg-4 mb-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">Gasto</h5>
            <p className="card-text text-center">{formatarValor(gastos)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardResumo;
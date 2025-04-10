import { supabase } from "./supabase"; // Importando a configuração do Supabase

// Função para adicionar um novo movimento à tabela "Movimento"
export const addMovimento = async (data) => {
  const { error } = await supabase.from("Movimento").insert([data]);

  if (error) {
    console.error("Erro ao inserir movimento:", error.message);
    throw error;
  }
};

// Função para buscar os movimentos do usuário autenticado com filtros de mês e ano
export const buscarMovimentos = async (userId, mes, ano) => {
  if (!userId) return [];

  const dataAtual = new Date();

  // Define ano e mês padrão, caso não sejam fornecidos
  const anoSelecionado = ano ? parseInt(ano) : dataAtual.getFullYear();
  const mesIndex = mes ? parseInt(mes) : dataAtual.getMonth() + 1;

  // Primeiro dia do mês às 00:00:00
  const primeiroDia = new Date(anoSelecionado, mesIndex - 1, 1, 0, 0, 0);
  // Último dia do mês às 23:59:59
  const ultimoDia = new Date(anoSelecionado, mesIndex, 0, 23, 59, 59);

  // Converte para string no formato correto (YYYY-MM-DDTHH:MM:SS.sssZ)
  const primeiroDiaISO = primeiroDia.toISOString();
  const ultimoDiaISO = ultimoDia.toISOString();

  console.log("Filtrando de:", primeiroDiaISO, "até:", ultimoDiaISO); // Debug

  let { data, error } = await supabase
    .from("Movimento")
    .select("*")
    .eq("Id_usuario", userId)
    .gte("Data", primeiroDiaISO) // Filtra a partir do primeiro dia do mês às 00:00
    .lte("Data", ultimoDiaISO) // Filtra até o último dia do mês às 23:59

  if (error) {
    console.error("Erro ao buscar movimentos:", error.message);
    throw error;
  }

  return data;
};

export const atualizarMovimento = async (movimento) => {
  const { error } = await supabase
    .from("Movimento")
    .update({
      Valor: movimento.Valor,
      Descricao: movimento.Descricao,
      Data: movimento.Data,
      Tipo: movimento.Tipo
    })
    .eq("Id_mov", movimento.Id_mov)
    .eq("Id_usuario", movimento.Id_usuario);

  if (error) {
    console.error("Erro ao atualizar movimento:", error.message);
    throw error;
  }
};

export const excluirMovimento = async (id_mov, id_usuario) => {
  const { error } = await supabase
    .from("Movimento")
    .delete()
    .eq("Id_mov", id_mov)
    .eq("Id_usuario", id_usuario);

  if (error) {
    console.error("Erro ao excluir movimento:", error.message);
    throw error;
  }
};

export async function adicionarMovimentoCofre(userId, cofreId, valor, data) {
  const { error } = await supabase.from("Movimento").insert([
    {
      Id_usuario: userId,
      Tipo: 3,
      Valor: valor,
      Data: data,
      Cofre_User: userId,  // ✅ correto
      Cofre_Id: cofreId,   // ✅ correto
    },
  ]);
  if (error) throw error;
}
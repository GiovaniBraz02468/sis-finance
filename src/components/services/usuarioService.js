import { supabase } from "./supabase";

// Verifica se já existe um registro na tabela Usuario para o userId
export async function verificarUsuario(userId) {
  const { data, error } = await supabase
    .from("Usuario")
    .select("*")
    .eq("Id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Erro ao verificar usuário:", error);
    return null;
  }

  return data;
}

// Cadastra um novo usuário na tabela Usuario
export async function criarUsuario({ Id, Nome, Sobrenome }) {
  const { data, error } = await supabase.from("Usuario").insert([
    { Id, Nome, Sobrenome },
  ]);

  if (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return null;
  }

  return data;
}

// Atualiza um usuário existente
export async function atualizarUsuario(id, dados) {
  const { error } = await supabase
    .from("Usuario")
    .update(dados)
    .eq("Id", id);

  if (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}
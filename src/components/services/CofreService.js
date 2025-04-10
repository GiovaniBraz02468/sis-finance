import { supabase } from "./supabase";

export async function getCofres(userId) {
  const { data, error } = await supabase
    .from("View_Cofre_Usuario")
    .select("*")
    .eq("Id_Usuario", userId);

  if (error) {
    console.error("Erro ao buscar cofres:", error);
    return [];
  }

  // Padronizando os campos pro frontend continuar funcionando
  return data.map((item) => ({
    Id: item.Id_Cofre,
    Nome: item.Nome_Cofre,
    Valor: item.Valor_Cofre,
  }));
}

export async function criarCofre(userId, nome) {
  const nomeFormatado = nome.trim().toUpperCase();
  const { data, error } = await supabase
    .from("Cofre")
    .insert([{ Id_User: userId, Nome: nomeFormatado }]);

  if (error) {
    console.error("Erro ao criar cofre:", error);
    return null;
  }

  return data;
}

// ✅ Função para excluir cofre e seus movimentos associados
export async function excluirCofre(cofreId, userId) {
  const { error } = await supabase
    .from("Cofre")
    .delete()
    .match({ Id: cofreId, Id_User: userId });

  if (error) {
    throw error; // 👈 isso vai para o catch lá no Cofres.js
  }
}
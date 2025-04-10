import { supabase } from './supabase'

async function getUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id
}

export async function getPatrimonios() {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('Patrimonio')
    .select('*')
    .eq('Id_User', userId)
    .order('Id', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data || []
}

export async function adicionarPatrimonio({ nome, descricao, valor }) {
  const userId = await getUserId()
  if (!userId) return

  const { error } = await supabase.from('Patrimonio').insert({
    Id_User: userId,
    Nome: nome,
    Descricao: descricao,
    Valor: valor,
  })

  if (error) console.error(error)
}

// 🟡 Atualizar patrimônio
export async function atualizarPatrimonio(patrimonio) {
  const { Id, Id_User, ...dadosAtualizados } = patrimonio

  const { error } = await supabase
      .from('Patrimonio')
      .update(dadosAtualizados)
      .eq('Id', Id)
      .eq('Id_User', Id_User)

  if (error) {
      console.error('Erro ao atualizar patrimônio:', error)
      throw error
  }
}


export async function excluirPatrimonio(patrimonio) {
  const { error } = await supabase
    .from('Patrimonio')
    .delete()
    .match({
      Id_User: patrimonio.Id_User, // Nome EXATO conforme o Supabase
      Id: patrimonio.Id,
    });

  if (error) {
    console.error('Erro Supabase:', error.message, error.details);
    throw error;
  }
}

export async function getResumoPatrimonioECofre(userId) {
  const { data, error } = await supabase
      .from('view_patrimonio_cofre_usuario')
      .select('*')
      .eq('Id_User', userId)
      .single()

  if (error) {
      console.error('Erro ao buscar resumo:', error)
      return null
  }

  return data
}
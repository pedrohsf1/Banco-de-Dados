const { getConnection } = require('../db')

async function criar(data) {
  const pool = await getConnection()
  await pool.request()
    .input('matricula', data.matricula)
    .input('nome', data.nome)
    .input('email', data.email)
    .input('telefone', data.telefone)
    .execute('SP_Inserir_Aluno')
}

async function listar(matricula) {
  const pool = await getConnection()
  const result = await pool.request()
    .input('matricula', matricula || null)
    .execute('SP_Consultar_Aluno')
  return result.recordset
}

async function atualizar(id, data) {
  const pool = await getConnection()
  await pool.request()
    .input('id_aluno', id)
    .input('nome', data.nome)
    .input('email', data.email)
    .input('telefone', data.telefone)
    .input('status_bloqueio', data.status_bloqueio)
    .execute('SP_Atualizar_Aluno')
}

async function excluir(id) {
  const pool = await getConnection()
  await pool.request()
    .input('id_aluno', id)
    .execute('SP_Excluir_Aluno')
}

module.exports = { criar, listar, atualizar, excluir }

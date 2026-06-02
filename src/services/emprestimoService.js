const { getConnection } = require('../db')

async function registrar(data) {
  const pool = await getConnection()
  await pool.request()
    .input('id_aluno', data.id_aluno)
    .input('id_exemplar', data.id_exemplar)
    .input('id_funcionario', data.id_funcionario)
    .input('dias_emprestimo', data.dias_emprestimo || 7)
    .execute('SP_Registrar_Emprestimo')
}

async function devolver(id, valor_multa_diaria) {
  const pool = await getConnection()
  await pool.request()
    .input('id_emprestimo', id)
    .input('valor_multa_diaria', valor_multa_diaria || 2.50)
    .execute('SP_Registrar_Devolucao')
}

async function listar() {
  const pool = await getConnection()
  const result = await pool.request().execute('SP_Consultar_Emprestimos_Ativos')
  return result.recordset
}

async function listarTodos(filtro, status) {
  const pool = await getConnection()
  const result = await pool.request()
    .input('filtro', filtro || null)
    .input('status', status || null)
    .execute('SP_Consultar_Historico_Emprestimos')
  return result.recordset
}

module.exports = { registrar, devolver, listar, listarTodos }

const { getConnection } = require('../db')

async function listar() {
  const pool = await getConnection()
  const result = await pool.request().execute('SP_Consultar_Area')
  return result.recordset
}

async function criar(data) {
  const pool = await getConnection()
  await pool.request()
    .input('descricao', data.descricao)
    .execute('SP_Inserir_Area')
}

async function atualizar(id, data) {
  const pool = await getConnection()
  await pool.request()
    .input('id_area', id)
    .input('descricao', data.descricao)
    .execute('SP_Atualizar_Area')
}

async function excluir(id) {
  const pool = await getConnection()
  await pool.request()
    .input('id_area', id)
    .execute('SP_Excluir_Area')
}

module.exports = { listar, criar, atualizar, excluir }

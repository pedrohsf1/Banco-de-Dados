const { getConnection } = require('../db')

async function listar() {
  const pool = await getConnection()
  const result = await pool.request().execute('SP_Consultar_Autor')
  return result.recordset
}

async function criar(data) {
  const pool = await getConnection()
  await pool.request()
    .input('nome', data.nome)
    .execute('SP_Inserir_Autor')
}

module.exports = { listar, criar }

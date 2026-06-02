const { getConnection } = require('../db')

async function listar() {
  const pool = await getConnection()
  const result = await pool.request().execute('SP_Consultar_Editora')
  return result.recordset
}

module.exports = { listar }

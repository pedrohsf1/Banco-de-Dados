const { getConnection } = require('../db')

async function listar(filtro) {
  const pool = await getConnection()
  const result = await pool.request()
    .input('filtro', filtro || null)
    .execute('SP_Consultar_Exemplar')
  return result.recordset
}

module.exports = { listar }

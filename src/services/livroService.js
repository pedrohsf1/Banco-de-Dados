const { getConnection } = require('../db')

async function criar(data) {
  const pool = await getConnection()
  const autoresStr = data.id_autores && data.id_autores.length > 0
    ? data.id_autores.join(',')
    : null
  await pool.request()
    .input('isbn', data.isbn)
    .input('titulo', data.titulo)
    .input('ano_publicacao', data.ano_publicacao || null)
    .input('id_editora', data.id_editora || null)
    .input('id_area', data.id_area || null)
    .input('autores_ids', autoresStr)
    .execute('SP_Inserir_Livro')
}

async function listar(filtro) {
  const pool = await getConnection()
  const result = await pool.request()
    .input('filtro', filtro || null)
    .execute('SP_Consultar_Livro')
  return result.recordset
}

module.exports = { criar, listar }

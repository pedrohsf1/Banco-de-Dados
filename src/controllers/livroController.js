const livroService = require('../services/livroService')

async function create(req, res) {
  try {
    const data = req.body
    if (data.id_autores && Array.isArray(data.id_autores)) {
      data.id_autores = data.id_autores.map(Number)
    }
    await livroService.criar(data)
    res.status(201).json({ message: 'Livro cadastrado com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function list(req, res) {
  try {
    const livros = await livroService.listar(req.query.q)
    res.json(livros)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { create, list }

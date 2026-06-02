const autorService = require('../services/autorService')

async function create(req, res) {
  try {
    await autorService.criar(req.body)
    res.status(201).json({ message: 'Autor cadastrado com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function list(req, res) {
  try {
    const autores = await autorService.listar()
    res.json(autores)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { create, list }

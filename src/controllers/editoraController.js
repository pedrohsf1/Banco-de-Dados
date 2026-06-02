const editoraService = require('../services/editoraService')

async function list(req, res) {
  try {
    const editoras = await editoraService.listar()
    res.json(editoras)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { list }

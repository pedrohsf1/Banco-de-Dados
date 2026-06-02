const funcionarioService = require('../services/funcionarioService')

async function list(req, res) {
  try {
    const funcionarios = await funcionarioService.listar()
    res.json(funcionarios)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { list }

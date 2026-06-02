const exemplarService = require('../services/exemplarService')

async function list(req, res) {
  try {
    const exemplares = await exemplarService.listar(req.query.q)
    res.json(exemplares)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { list }

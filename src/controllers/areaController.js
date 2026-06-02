const areaService = require('../services/areaService')

async function create(req, res) {
  try {
    await areaService.criar(req.body)
    res.status(201).json({ message: 'Área cadastrada com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function list(req, res) {
  try {
    const areas = await areaService.listar()
    res.json(areas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function update(req, res) {
  try {
    await areaService.atualizar(Number(req.params.id), req.body)
    res.json({ message: 'Área atualizada com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function remove(req, res) {
  try {
    await areaService.excluir(Number(req.params.id))
    res.json({ message: 'Área excluída com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { create, list, update, remove }

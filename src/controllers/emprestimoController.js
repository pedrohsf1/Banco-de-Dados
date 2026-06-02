const emprestimoService = require('../services/emprestimoService')

async function create(req, res) {
  try {
    await emprestimoService.registrar(req.body)
    res.status(201).json({ message: 'Empréstimo registrado com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function devolver(req, res) {
  try {
    await emprestimoService.devolver(Number(req.params.id), req.body.valor_multa_diaria)
    res.json({ message: 'Devolução registrada com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function list(req, res) {
  try {
    const emprestimos = await emprestimoService.listar()
    res.json(emprestimos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function listAll(req, res) {
  try {
    const emprestimos = await emprestimoService.listarTodos(req.query.q, req.query.status)
    res.json(emprestimos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { create, devolver, list, listAll }

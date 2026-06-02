const alunoService = require('../services/alunoService')

async function create(req, res) {
  try {
    await alunoService.criar(req.body)
    res.status(201).json({ message: 'Aluno cadastrado com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function list(req, res) {
  try {
    const alunos = await alunoService.listar(req.query.matricula)
    res.json(alunos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function update(req, res) {
  try {
    await alunoService.atualizar(Number(req.params.id), req.body)
    res.json({ message: 'Aluno atualizado com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

async function remove(req, res) {
  try {
    await alunoService.excluir(Number(req.params.id))
    res.json({ message: 'Aluno excluído com sucesso' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = { create, list, update, remove }

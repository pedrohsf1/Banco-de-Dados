const { Router } = require('express')
const controller = require('../controllers/emprestimoController')

const router = Router()

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/todos', controller.listAll)
router.put('/:id/devolver', controller.devolver)

module.exports = router

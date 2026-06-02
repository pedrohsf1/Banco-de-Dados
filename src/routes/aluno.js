const { Router } = require('express')
const controller = require('../controllers/alunoController')

const router = Router()

router.post('/', controller.create)
router.get('/', controller.list)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router

const { Router } = require('express')
const controller = require('../controllers/livroController')

const router = Router()

router.post('/', controller.create)
router.get('/', controller.list)

module.exports = router

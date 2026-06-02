const { Router } = require('express')
const controller = require('../controllers/autorController')

const router = Router()

router.post('/', controller.create)
router.get('/', controller.list)

module.exports = router

const { Router } = require('express')
const controller = require('../controllers/funcionarioController')

const router = Router()

router.get('/', controller.list)

module.exports = router

const { Router } = require('express')
const controller = require('../controllers/editoraController')

const router = Router()

router.get('/', controller.list)

module.exports = router

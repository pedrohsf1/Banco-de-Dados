const { Router } = require('express')
const controller = require('../controllers/exemplarController')

const router = Router()

router.get('/', controller.list)

module.exports = router

const express = require('express')
const router = express.Router()
const handsController = require('../../controllers/api/hands')

router.post('/add', handsController.add)

module.exports = router
const express = require('express')
const router = express.Router()
const bankrollController = require('../../controllers/api/bankroll')

router.put('/:userId', bankrollController.update)

module.exports = router
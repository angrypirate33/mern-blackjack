const express = require('express')
const router = express.Router()
const bankrollController = require('../../controllers/api/bankrolls')

router.put('/:userId', bankrollController.update)

module.exports = router

const express = require('express');
const router = express.Router();

const studentController = require('../controller/student')


router.post("/register", studentController.signUp)
router.post('/login', studentController.login)


module.exports = router


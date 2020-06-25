const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

const router = express.Router();

router.post('/signup', authValidator.postSignUpValidator, authController.postSignUp);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Todas as rotas delegam para o controller — sem lógica inline aqui
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;

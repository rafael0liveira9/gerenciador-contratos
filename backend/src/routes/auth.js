const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/verificar', authController.verificarToken);
router.get('/empresa/:slug', authController.verificarEmpresa);

module.exports = router;

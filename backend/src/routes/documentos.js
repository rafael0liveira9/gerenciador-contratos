const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/documentosController');

router.post('/gerar', documentosController.gerar);
router.get('/empresa/:empresaId', documentosController.getByEmpresa);
router.get('/:id', documentosController.getById);
router.delete('/:id', documentosController.remove);

module.exports = router;

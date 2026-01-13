const express = require('express');
const router = express.Router();
const contratosController = require('../controllers/contratosController');

router.get('/empresa/:empresaId', contratosController.getByEmpresa);
router.get('/:id', contratosController.getById);
router.post('/', contratosController.create);
router.put('/:id', contratosController.update);
router.post('/:id/assinar', contratosController.assinar);
router.post('/:id/concluir', contratosController.concluir);
router.post('/:id/cancelar', contratosController.cancelar);

module.exports = router;

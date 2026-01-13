const express = require('express');
const router = express.Router();
const cabecalhosController = require('../controllers/cabecalhosController');

router.get('/empresa/:empresaId', cabecalhosController.getByEmpresa);
router.get('/:id', cabecalhosController.getById);
router.post('/', cabecalhosController.create);
router.put('/:id', cabecalhosController.update);
router.delete('/:id', cabecalhosController.remove);

module.exports = router;

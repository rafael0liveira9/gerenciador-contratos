const express = require('express');
const router = express.Router();
const clausulasController = require('../controllers/clausulasController');

router.get('/empresa/:empresaId', clausulasController.getByEmpresa);
router.get('/:id', clausulasController.getById);
router.post('/', clausulasController.create);
router.put('/:id', clausulasController.update);
router.delete('/:id', clausulasController.remove);

module.exports = router;

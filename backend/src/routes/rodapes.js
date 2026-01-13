const express = require('express');
const router = express.Router();
const rodapesController = require('../controllers/rodapesController');

router.get('/empresa/:empresaId', rodapesController.getByEmpresa);
router.get('/:id', rodapesController.getById);
router.post('/', rodapesController.create);
router.put('/:id', rodapesController.update);
router.delete('/:id', rodapesController.remove);

module.exports = router;

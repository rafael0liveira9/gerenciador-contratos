const express = require('express');
const router = express.Router();
const variaveisController = require('../controllers/variaveisController');

router.get('/empresa/:empresaId', variaveisController.getByEmpresa);
router.get('/empresa/:empresaId/search', variaveisController.search);
router.get('/:id', variaveisController.getById);
router.post('/', variaveisController.create);
router.put('/:id', variaveisController.update);
router.delete('/:id', variaveisController.remove);

module.exports = router;

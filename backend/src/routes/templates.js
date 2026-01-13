const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');

router.get('/empresa/:empresaId', templatesController.getByEmpresa);
router.get('/:id', templatesController.getById);
router.post('/', templatesController.create);
router.put('/:id', templatesController.update);
router.delete('/:id', templatesController.remove);

module.exports = router;

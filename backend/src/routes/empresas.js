const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.get('/', empresaController.getAll);
router.get('/slug/:slug', empresaController.getBySlug);
router.post('/', empresaController.create);
router.put('/:id', empresaController.update);
router.delete('/:id', empresaController.remove);

module.exports = router;

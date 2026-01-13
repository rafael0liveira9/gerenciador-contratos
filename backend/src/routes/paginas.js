const express = require('express');
const router = express.Router();
const paginasController = require('../controllers/paginasController');

router.get('/template/:templateId', paginasController.getByTemplate);
router.get('/:id', paginasController.getById);
router.post('/', paginasController.create);
router.put('/:id', paginasController.update);
router.delete('/:id', paginasController.remove);

module.exports = router;

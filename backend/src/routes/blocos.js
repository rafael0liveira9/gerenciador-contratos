const express = require('express');
const router = express.Router();
const blocosController = require('../controllers/blocosController');

router.get('/pagina/:paginaId', blocosController.getByPagina);
router.get('/:id', blocosController.getById);
router.post('/', blocosController.create);
router.put('/:id', blocosController.update);
router.delete('/:id', blocosController.remove);
router.post('/reorder', blocosController.reorder);

module.exports = router;

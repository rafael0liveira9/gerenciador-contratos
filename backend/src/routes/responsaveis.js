const express = require('express');
const router = express.Router();
const responsaveisController = require('../controllers/responsaveisController');

router.get('/empresa/:empresaId', responsaveisController.getByEmpresa);
router.get('/:id', responsaveisController.getById);
router.post('/', responsaveisController.create);
router.put('/:id', responsaveisController.update);
router.delete('/:id', responsaveisController.remove);

module.exports = router;

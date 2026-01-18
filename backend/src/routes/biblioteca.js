const express = require('express');
const router = express.Router();
const bibliotecaController = require('../controllers/bibliotecaController');

// GET /api/biblioteca/:empresaId?search=&page=&limit=
router.get('/:empresaId', bibliotecaController.search);

module.exports = router;

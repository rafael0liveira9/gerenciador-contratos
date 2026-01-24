const express = require('express');
const router = express.Router();
const { integrationAuth } = require('../middleware/integrationAuth');
const integrationController = require('../controllers/integrationController');

// Todas as rotas de integração requerem autenticação JWT
router.use(integrationAuth);

// GET /api/v1/templates - Lista templates da empresa
router.get('/templates', integrationController.getTemplates);

// GET /api/v1/templates/:id - Retorna template com variáveis
router.get('/templates/:id', integrationController.getTemplateById);

// POST /api/v1/contracts/generate - Gera contrato PDF
router.post('/contracts/generate', integrationController.generateContract);

module.exports = router;

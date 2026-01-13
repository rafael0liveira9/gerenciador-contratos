const express = require('express');
const { body, param, validationResult } = require('express-validator');
const controller = require('../controllers/contractsController');

const router = express.Router();

// Middleware de validacao
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/contracts - Listar contratos
router.get('/', controller.getAll);

// GET /api/contracts/:id - Obter contrato por ID
router.get('/:id',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.getById
);

// GET /api/contracts/:id/export - Exportar contrato como JSON
router.get('/:id/export',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.exportContract
);

// POST /api/contracts - Criar novo contrato
router.post('/',
  body('title').notEmpty().withMessage('Title is required'),
  validate,
  controller.create
);

// PUT /api/contracts/:id - Atualizar contrato
router.put('/:id',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.update
);

// DELETE /api/contracts/:id - Deletar contrato
router.delete('/:id',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.remove
);

module.exports = router;

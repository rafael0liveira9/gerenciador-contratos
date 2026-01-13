const express = require('express');
const { body, param, validationResult } = require('express-validator');
const controller = require('../controllers/clausesController');

const router = express.Router();

// Middleware de validacao
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/clauses - Listar clausulas
router.get('/', controller.getAll);

// GET /api/clauses/:id - Obter clausula por ID
router.get('/:id',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.getById
);

// GET /api/clauses/:id/versions - Listar versoes de uma clausula
router.get('/:id/versions',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.getVersions
);

// POST /api/clauses - Criar nova clausula
router.post('/',
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  validate,
  controller.create
);

// POST /api/clauses/:id/versions - Criar nova versao
router.post('/:id/versions',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.createVersion
);

// DELETE /api/clauses/:id - Deletar clausula
router.delete('/:id',
  param('id').isInt().withMessage('ID must be an integer'),
  validate,
  controller.remove
);

module.exports = router;

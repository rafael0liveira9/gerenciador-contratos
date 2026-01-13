const express = require('express');
const { body, param, validationResult } = require('express-validator');
const controller = require('../controllers/contractBlocksController');

const router = express.Router();

// Middleware de validacao
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/contract-blocks/:contractId - Adicionar bloco ao contrato
router.post('/:contractId',
  param('contractId').isInt().withMessage('Contract ID must be an integer'),
  body('type').isIn(['TITLE', 'CLAUSE', 'OBS']).withMessage('Type must be TITLE, CLAUSE or OBS'),
  validate,
  controller.addBlock
);

// PUT /api/contract-blocks/:blockId - Atualizar bloco
router.put('/:blockId',
  param('blockId').isInt().withMessage('Block ID must be an integer'),
  validate,
  controller.updateBlock
);

// DELETE /api/contract-blocks/:blockId - Remover bloco
router.delete('/:blockId',
  param('blockId').isInt().withMessage('Block ID must be an integer'),
  validate,
  controller.removeBlock
);

// PUT /api/contract-blocks/:contractId/reorder - Reordenar blocos
router.put('/:contractId/reorder',
  param('contractId').isInt().withMessage('Contract ID must be an integer'),
  body('blocks').isArray().withMessage('Blocks must be an array'),
  validate,
  controller.reorderBlocks
);

// POST /api/contract-blocks/:contractId/recalculate - Recalcular numeracao
router.post('/:contractId/recalculate',
  param('contractId').isInt().withMessage('Contract ID must be an integer'),
  validate,
  controller.recalculateNumberingEndpoint
);

module.exports = router;

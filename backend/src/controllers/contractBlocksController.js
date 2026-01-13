const prisma = require('../services/prisma');
const { recalculateNumbering } = require('../utils/numbering');

// Adicionar bloco ao contrato
async function addBlock(req, res) {
  try {
    const { contractId } = req.params;
    const { type, clauseId, content, level = 1, order, htmlTag = 'p', styles } = req.body;

    // Validacao: CLAUSE exige clauseId
    if (type === 'CLAUSE' && !clauseId) {
      return res.status(400).json({ error: 'clauseId is required for CLAUSE type' });
    }

    // Validacao: TITLE/OBS nao podem ter clauseId
    if ((type === 'TITLE' || type === 'OBS') && clauseId) {
      return res.status(400).json({ error: 'clauseId is not allowed for TITLE/OBS type' });
    }

    // Se order nao especificado, adiciona no final
    let blockOrder = order;
    if (blockOrder === undefined) {
      const lastBlock = await prisma.contractBlock.findFirst({
        where: { contractId: parseInt(contractId) },
        orderBy: { order: 'desc' }
      });
      blockOrder = lastBlock ? lastBlock.order + 1 : 0;
    } else {
      // Desloca blocos existentes
      await prisma.contractBlock.updateMany({
        where: {
          contractId: parseInt(contractId),
          order: { gte: blockOrder }
        },
        data: {
          order: { increment: 1 }
        }
      });
    }

    // Define htmlTag padrao baseado no tipo
    let defaultHtmlTag = htmlTag;
    if (type === 'TITLE' && htmlTag === 'p') {
      defaultHtmlTag = 'h2';
    }

    const block = await prisma.contractBlock.create({
      data: {
        contractId: parseInt(contractId),
        type,
        clauseId: clauseId ? parseInt(clauseId) : null,
        content: type !== 'CLAUSE' ? content : null,
        htmlTag: defaultHtmlTag,
        styles: styles ? JSON.stringify(styles) : null,
        level,
        order: blockOrder
      },
      include: {
        clause: true
      }
    });

    // Recalcula numeracao
    await recalculateContractNumbering(parseInt(contractId));

    // Busca bloco atualizado com numeracao
    const updatedBlock = await prisma.contractBlock.findUnique({
      where: { id: block.id },
      include: { clause: true }
    });

    res.status(201).json(updatedBlock);
  } catch (error) {
    console.error('Error adding block:', error);
    res.status(500).json({ error: 'Failed to add block' });
  }
}

// Atualizar bloco
async function updateBlock(req, res) {
  try {
    const { blockId } = req.params;
    const { content, level, clauseId, htmlTag, styles } = req.body;

    const existingBlock = await prisma.contractBlock.findUnique({
      where: { id: parseInt(blockId) }
    });

    if (!existingBlock) {
      return res.status(404).json({ error: 'Block not found' });
    }

    const updateData = {};

    if (level !== undefined) {
      updateData.level = level;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    if (clauseId !== undefined && existingBlock.type === 'CLAUSE') {
      updateData.clauseId = parseInt(clauseId);
    }

    if (htmlTag !== undefined) {
      updateData.htmlTag = htmlTag;
    }

    if (styles !== undefined) {
      updateData.styles = JSON.stringify(styles);
    }

    const block = await prisma.contractBlock.update({
      where: { id: parseInt(blockId) },
      data: updateData,
      include: { clause: true }
    });

    // Recalcula numeracao se nivel mudou
    if (level !== undefined) {
      await recalculateContractNumbering(block.contractId);
    }

    const updatedBlock = await prisma.contractBlock.findUnique({
      where: { id: block.id },
      include: { clause: true }
    });

    res.json(updatedBlock);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
}

// Remover bloco
async function removeBlock(req, res) {
  try {
    const { blockId } = req.params;

    const block = await prisma.contractBlock.findUnique({
      where: { id: parseInt(blockId) }
    });

    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    const contractId = block.contractId;

    await prisma.contractBlock.delete({
      where: { id: parseInt(blockId) }
    });

    // Reordena blocos restantes
    const remainingBlocks = await prisma.contractBlock.findMany({
      where: { contractId },
      orderBy: { order: 'asc' }
    });

    for (let i = 0; i < remainingBlocks.length; i++) {
      await prisma.contractBlock.update({
        where: { id: remainingBlocks[i].id },
        data: { order: i }
      });
    }

    // Recalcula numeracao
    await recalculateContractNumbering(contractId);

    res.status(204).send();
  } catch (error) {
    console.error('Error removing block:', error);
    res.status(500).json({ error: 'Failed to remove block' });
  }
}

// Reordenar blocos
async function reorderBlocks(req, res) {
  try {
    const { contractId } = req.params;
    const { blocks } = req.body; // Array de { id, order, level }

    if (!Array.isArray(blocks)) {
      return res.status(400).json({ error: 'blocks must be an array' });
    }

    // Atualiza cada bloco
    for (const block of blocks) {
      await prisma.contractBlock.update({
        where: { id: block.id },
        data: {
          order: block.order,
          level: block.level !== undefined ? block.level : undefined
        }
      });
    }

    // Recalcula numeracao
    await recalculateContractNumbering(parseInt(contractId));

    // Retorna blocos atualizados
    const updatedBlocks = await prisma.contractBlock.findMany({
      where: { contractId: parseInt(contractId) },
      orderBy: { order: 'asc' },
      include: { clause: true }
    });

    res.json(updatedBlocks);
  } catch (error) {
    console.error('Error reordering blocks:', error);
    res.status(500).json({ error: 'Failed to reorder blocks' });
  }
}

// Recalcular numeracao do contrato
async function recalculateNumberingEndpoint(req, res) {
  try {
    const { contractId } = req.params;

    await recalculateContractNumbering(parseInt(contractId));

    const blocks = await prisma.contractBlock.findMany({
      where: { contractId: parseInt(contractId) },
      orderBy: { order: 'asc' },
      include: { clause: true }
    });

    res.json(blocks);
  } catch (error) {
    console.error('Error recalculating numbering:', error);
    res.status(500).json({ error: 'Failed to recalculate numbering' });
  }
}

// Funcao auxiliar para recalcular numeracao
async function recalculateContractNumbering(contractId) {
  const blocks = await prisma.contractBlock.findMany({
    where: { contractId },
    orderBy: { order: 'asc' }
  });

  const numberedBlocks = recalculateNumbering(blocks);

  for (const block of numberedBlocks) {
    await prisma.contractBlock.update({
      where: { id: block.id },
      data: { numbering: block.numbering }
    });
  }
}

module.exports = {
  addBlock,
  updateBlock,
  removeBlock,
  reorderBlocks,
  recalculateNumberingEndpoint
};

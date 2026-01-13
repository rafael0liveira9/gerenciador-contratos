const prisma = require('../services/prisma');
const { recalculateNumbering } = require('../utils/numbering');

// Listar todos os contratos
async function getAll(req, res) {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { blocks: true }
        }
      }
    });

    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
}

// Obter contrato por ID com blocos
async function getById(req, res) {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id: parseInt(id) },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
          include: {
            clause: true
          }
        }
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
}

// Criar novo contrato
async function create(req, res) {
  try {
    const { title, description } = req.body;

    const contract = await prisma.contract.create({
      data: {
        title,
        description
      }
    });

    res.status(201).json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
}

// Atualizar contrato
async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const contract = await prisma.contract.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description
      }
    });

    res.json(contract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
}

// Deletar contrato
async function remove(req, res) {
  try {
    const { id } = req.params;

    await prisma.contract.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
}

// Exportar contrato como JSON estruturado
async function exportContract(req, res) {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id: parseInt(id) },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
          include: {
            clause: true
          }
        }
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Estrutura o JSON de exportacao
    const exportData = {
      id: contract.id,
      title: contract.title,
      description: contract.description,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      blocks: contract.blocks.map(block => ({
        id: block.id,
        type: block.type,
        numbering: block.numbering,
        level: block.level,
        order: block.order,
        content: block.type === 'CLAUSE'
          ? block.clause?.content
          : block.content,
        clauseInfo: block.clause ? {
          id: block.clause.id,
          title: block.clause.title,
          version: block.clause.version
        } : null
      }))
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting contract:', error);
    res.status(500).json({ error: 'Failed to export contract' });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  exportContract
};

const prisma = require('../services/prisma');

// Listar todas as clausulas (versao mais recente de cada)
async function getAll(req, res) {
  try {
    const { search } = req.query;

    const where = {
      parentId: null // Apenas clausulas originais (nao versoes)
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ];
    }

    const clauses = await prisma.clause.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    });

    // Retorna a versao mais recente de cada clausula
    const result = clauses.map(clause => {
      if (clause.versions.length > 0) {
        return clause.versions[0];
      }
      return clause;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching clauses:', error);
    res.status(500).json({ error: 'Failed to fetch clauses' });
  }
}

// Obter clausula por ID
async function getById(req, res) {
  try {
    const { id } = req.params;

    const clause = await prisma.clause.findUnique({
      where: { id: parseInt(id) },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        },
        parent: true
      }
    });

    if (!clause) {
      return res.status(404).json({ error: 'Clause not found' });
    }

    res.json(clause);
  } catch (error) {
    console.error('Error fetching clause:', error);
    res.status(500).json({ error: 'Failed to fetch clause' });
  }
}

// Criar nova clausula
async function create(req, res) {
  try {
    const { title, content } = req.body;

    const clause = await prisma.clause.create({
      data: {
        title,
        content,
        version: 1
      }
    });

    res.status(201).json(clause);
  } catch (error) {
    console.error('Error creating clause:', error);
    res.status(500).json({ error: 'Failed to create clause' });
  }
}

// Criar nova versao de uma clausula (nao edita a original)
async function createVersion(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const original = await prisma.clause.findUnique({
      where: { id: parseInt(id) },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    });

    if (!original) {
      return res.status(404).json({ error: 'Clause not found' });
    }

    // Determina o ID pai (clausula original)
    const parentId = original.parentId || original.id;

    // Determina a proxima versao
    const latestVersion = original.versions.length > 0
      ? original.versions[0].version
      : original.version;

    const newVersion = await prisma.clause.create({
      data: {
        title: title || original.title,
        content: content || original.content,
        version: latestVersion + 1,
        parentId
      }
    });

    res.status(201).json(newVersion);
  } catch (error) {
    console.error('Error creating clause version:', error);
    res.status(500).json({ error: 'Failed to create clause version' });
  }
}

// Deletar clausula (e todas as versoes)
async function remove(req, res) {
  try {
    const { id } = req.params;

    // Deleta versoes primeiro
    await prisma.clause.deleteMany({
      where: { parentId: parseInt(id) }
    });

    // Deleta a clausula original
    await prisma.clause.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting clause:', error);
    res.status(500).json({ error: 'Failed to delete clause' });
  }
}

// Listar todas as versoes de uma clausula
async function getVersions(req, res) {
  try {
    const { id } = req.params;

    const clause = await prisma.clause.findUnique({
      where: { id: parseInt(id) }
    });

    if (!clause) {
      return res.status(404).json({ error: 'Clause not found' });
    }

    // Se for uma versao, busca a partir do pai
    const parentId = clause.parentId || clause.id;

    const versions = await prisma.clause.findMany({
      where: {
        OR: [
          { id: parentId },
          { parentId }
        ]
      },
      orderBy: { version: 'desc' }
    });

    res.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  createVersion,
  remove,
  getVersions
};

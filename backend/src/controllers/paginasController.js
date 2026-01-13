const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const paginas = await prisma.pagina.findMany({
      where: {
        templateId: parseInt(templateId),
        dataExclusao: null
      },
      include: {
        blocos: {
          orderBy: { ordem: 'asc' },
          include: {
            clausula: true,
            cabecalho: true,
            rodape: true
          }
        }
      },
      orderBy: { ordem: 'asc' }
    });
    res.json(paginas);
  } catch (error) {
    console.error('Erro ao buscar paginas:', error);
    res.status(500).json({ error: 'Erro ao buscar paginas' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pagina = await prisma.pagina.findUnique({
      where: { id: parseInt(id) },
      include: {
        blocos: {
          orderBy: { ordem: 'asc' },
          include: {
            clausula: true,
            cabecalho: true,
            rodape: true
          }
        }
      }
    });

    if (!pagina) {
      return res.status(404).json({ error: 'Pagina não encontrada' });
    }

    res.json(pagina);
  } catch (error) {
    console.error('Erro ao buscar pagina:', error);
    res.status(500).json({ error: 'Erro ao buscar pagina' });
  }
};

const create = async (req, res) => {
  try {
    const { templateId, ordem, conteudo } = req.body;

    const maxOrdem = await prisma.pagina.aggregate({
      where: { templateId: parseInt(templateId), dataExclusao: null },
      _max: { ordem: true }
    });

    const pagina = await prisma.pagina.create({
      data: {
        templateId: parseInt(templateId),
        ordem: ordem ?? (maxOrdem._max.ordem || 0) + 1,
        conteudo: conteudo || ''
      },
      include: {
        blocos: true
      }
    });
    res.status(201).json(pagina);
  } catch (error) {
    console.error('Erro ao criar pagina:', error);
    res.status(500).json({ error: 'Erro ao criar pagina' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ordem, conteudo, ativo } = req.body;
    const pagina = await prisma.pagina.update({
      where: { id: parseInt(id) },
      data: { ordem, conteudo, ativo },
      include: {
        blocos: {
          orderBy: { ordem: 'asc' },
          include: {
            clausula: true,
            cabecalho: true,
            rodape: true
          }
        }
      }
    });
    res.json(pagina);
  } catch (error) {
    console.error('Erro ao atualizar pagina:', error);
    res.status(500).json({ error: 'Erro ao atualizar pagina' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pagina.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Pagina removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover pagina:', error);
    res.status(500).json({ error: 'Erro ao remover pagina' });
  }
};

module.exports = { getByTemplate, getById, create, update, remove };

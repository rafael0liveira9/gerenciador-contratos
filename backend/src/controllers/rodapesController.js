const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const rodapes = await prisma.rodape.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null
      },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(rodapes);
  } catch (error) {
    console.error('Erro ao buscar rodapes:', error);
    res.status(500).json({ error: 'Erro ao buscar rodapes' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const rodape = await prisma.rodape.findUnique({
      where: { id: parseInt(id) },
      include: { versions: true }
    });

    if (!rodape) {
      return res.status(404).json({ error: 'Rodape não encontrado' });
    }

    res.json(rodape);
  } catch (error) {
    console.error('Erro ao buscar rodape:', error);
    res.status(500).json({ error: 'Erro ao buscar rodape' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, nome, conteudo } = req.body;
    const rodape = await prisma.rodape.create({
      data: {
        empresaId: parseInt(empresaId),
        nome,
        conteudo,
        versao: 1
      }
    });
    res.status(201).json(rodape);
  } catch (error) {
    console.error('Erro ao criar rodape:', error);
    res.status(500).json({ error: 'Erro ao criar rodape' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, conteudo } = req.body;

    const original = await prisma.rodape.findUnique({
      where: { id: parseInt(id) }
    });

    if (!original) {
      return res.status(404).json({ error: 'Rodape não encontrado' });
    }

    const novaVersao = await prisma.rodape.create({
      data: {
        empresaId: original.empresaId,
        parentId: original.parentId || original.id,
        nome,
        conteudo,
        versao: original.versao + 1
      }
    });

    res.json(novaVersao);
  } catch (error) {
    console.error('Erro ao atualizar rodape:', error);
    res.status(500).json({ error: 'Erro ao atualizar rodape' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.rodape.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Rodape removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover rodape:', error);
    res.status(500).json({ error: 'Erro ao remover rodape' });
  }
};

module.exports = { getByEmpresa, getById, create, update, remove };

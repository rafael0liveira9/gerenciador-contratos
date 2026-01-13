const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const clausulas = await prisma.clausula.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null
      },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(clausulas);
  } catch (error) {
    console.error('Erro ao buscar clausulas:', error);
    res.status(500).json({ error: 'Erro ao buscar clausulas' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const clausula = await prisma.clausula.findUnique({
      where: { id: parseInt(id) },
      include: { versions: true }
    });

    if (!clausula) {
      return res.status(404).json({ error: 'Clausula não encontrada' });
    }

    res.json(clausula);
  } catch (error) {
    console.error('Erro ao buscar clausula:', error);
    res.status(500).json({ error: 'Erro ao buscar clausula' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, nome, conteudo } = req.body;
    const clausula = await prisma.clausula.create({
      data: {
        empresaId: parseInt(empresaId),
        nome,
        conteudo,
        versao: 1
      }
    });
    res.status(201).json(clausula);
  } catch (error) {
    console.error('Erro ao criar clausula:', error);
    res.status(500).json({ error: 'Erro ao criar clausula' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, conteudo } = req.body;

    const original = await prisma.clausula.findUnique({
      where: { id: parseInt(id) }
    });

    if (!original) {
      return res.status(404).json({ error: 'Clausula não encontrada' });
    }

    // Criar nova versão
    const novaVersao = await prisma.clausula.create({
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
    console.error('Erro ao atualizar clausula:', error);
    res.status(500).json({ error: 'Erro ao atualizar clausula' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.clausula.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Clausula removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover clausula:', error);
    res.status(500).json({ error: 'Erro ao remover clausula' });
  }
};

module.exports = { getByEmpresa, getById, create, update, remove };

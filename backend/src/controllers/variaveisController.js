const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const variaveis = await prisma.variavel.findMany({
      where: { empresaId: parseInt(empresaId) },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(variaveis);
  } catch (error) {
    console.error('Erro ao buscar variaveis:', error);
    res.status(500).json({ error: 'Erro ao buscar variaveis' });
  }
};

const search = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const { q } = req.query;

    const variaveis = await prisma.variavel.findMany({
      where: {
        empresaId: parseInt(empresaId),
        tag: {
          contains: q || ''
        }
      },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(variaveis);
  } catch (error) {
    console.error('Erro ao buscar variaveis:', error);
    res.status(500).json({ error: 'Erro ao buscar variaveis' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const variavel = await prisma.variavel.findUnique({
      where: { id: parseInt(id) }
    });

    if (!variavel) {
      return res.status(404).json({ error: 'Variavel não encontrada' });
    }

    res.json(variavel);
  } catch (error) {
    console.error('Erro ao buscar variavel:', error);
    res.status(500).json({ error: 'Erro ao buscar variavel' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, tag } = req.body;

    // Verificar se já existe uma variável com essa tag na empresa
    const existente = await prisma.variavel.findFirst({
      where: {
        empresaId: parseInt(empresaId),
        tag: tag
      }
    });

    if (existente) {
      return res.status(400).json({ error: 'Essa variável já existe' });
    }

    const variavel = await prisma.variavel.create({
      data: {
        empresaId: parseInt(empresaId),
        tag
      }
    });
    res.status(201).json(variavel);
  } catch (error) {
    console.error('Erro ao criar variavel:', error);
    res.status(500).json({ error: 'Erro ao criar variavel' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;
    const variavel = await prisma.variavel.update({
      where: { id: parseInt(id) },
      data: { tag }
    });
    res.json(variavel);
  } catch (error) {
    console.error('Erro ao atualizar variavel:', error);
    res.status(500).json({ error: 'Erro ao atualizar variavel' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.variavel.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Variavel removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover variavel:', error);
    res.status(500).json({ error: 'Erro ao remover variavel' });
  }
};

module.exports = { getByEmpresa, getById, search, create, update, remove };

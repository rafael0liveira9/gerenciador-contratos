const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const cabecalhos = await prisma.cabecalho.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null
      },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(cabecalhos);
  } catch (error) {
    console.error('Erro ao buscar cabecalhos:', error);
    res.status(500).json({ error: 'Erro ao buscar cabecalhos' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cabecalho = await prisma.cabecalho.findUnique({
      where: { id: parseInt(id) },
      include: { versions: true }
    });

    if (!cabecalho) {
      return res.status(404).json({ error: 'Cabecalho não encontrado' });
    }

    res.json(cabecalho);
  } catch (error) {
    console.error('Erro ao buscar cabecalho:', error);
    res.status(500).json({ error: 'Erro ao buscar cabecalho' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, nome, conteudo } = req.body;
    const cabecalho = await prisma.cabecalho.create({
      data: {
        empresaId: parseInt(empresaId),
        nome,
        conteudo,
        versao: 1
      }
    });
    res.status(201).json(cabecalho);
  } catch (error) {
    console.error('Erro ao criar cabecalho:', error);
    res.status(500).json({ error: 'Erro ao criar cabecalho' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, conteudo } = req.body;

    const original = await prisma.cabecalho.findUnique({
      where: { id: parseInt(id) }
    });

    if (!original) {
      return res.status(404).json({ error: 'Cabecalho não encontrado' });
    }

    const novaVersao = await prisma.cabecalho.create({
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
    console.error('Erro ao atualizar cabecalho:', error);
    res.status(500).json({ error: 'Erro ao atualizar cabecalho' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cabecalho.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Cabecalho removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover cabecalho:', error);
    res.status(500).json({ error: 'Erro ao remover cabecalho' });
  }
};

module.exports = { getByEmpresa, getById, create, update, remove };

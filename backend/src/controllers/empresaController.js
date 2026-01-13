const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const empresa = await prisma.empresa.findUnique({
      where: { slug, dataExclusao: null },
      include: {
        responsaveis: {
          where: { dataExclusao: null }
        }
      }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  }
};

const getAll = async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany({
      where: { dataExclusao: null }
    });
    res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ error: 'Erro ao listar empresas' });
  }
};

const create = async (req, res) => {
  try {
    const { documento, nome, slug, secret } = req.body;
    const empresa = await prisma.empresa.create({
      data: { documento, nome, slug, secret }
    });
    res.status(201).json(empresa);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { documento, nome, slug, secret, ativo } = req.body;
    const empresa = await prisma.empresa.update({
      where: { id: parseInt(id) },
      data: { documento, nome, slug, secret, ativo }
    });
    res.json(empresa);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.empresa.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Empresa removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover empresa:', error);
    res.status(500).json({ error: 'Erro ao remover empresa' });
  }
};

module.exports = { getBySlug, getAll, create, update, remove };

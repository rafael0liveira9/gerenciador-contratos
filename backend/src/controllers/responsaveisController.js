const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const responsaveis = await prisma.responsavel.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null
      },
      orderBy: { dataCriacao: 'desc' }
    });
    res.json(responsaveis);
  } catch (error) {
    console.error('Erro ao buscar responsaveis:', error);
    res.status(500).json({ error: 'Erro ao buscar responsaveis' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: parseInt(id) }
    });

    if (!responsavel) {
      return res.status(404).json({ error: 'Responsavel não encontrado' });
    }

    res.json(responsavel);
  } catch (error) {
    console.error('Erro ao buscar responsavel:', error);
    res.status(500).json({ error: 'Erro ao buscar responsavel' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, nome, cpf, telefone, email } = req.body;
    const responsavel = await prisma.responsavel.create({
      data: {
        empresaId: parseInt(empresaId),
        nome,
        cpf,
        telefone,
        email
      }
    });
    res.status(201).json(responsavel);
  } catch (error) {
    console.error('Erro ao criar responsavel:', error);
    res.status(500).json({ error: 'Erro ao criar responsavel' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, telefone, email } = req.body;
    const responsavel = await prisma.responsavel.update({
      where: { id: parseInt(id) },
      data: { nome, cpf, telefone, email }
    });
    res.json(responsavel);
  } catch (error) {
    console.error('Erro ao atualizar responsavel:', error);
    res.status(500).json({ error: 'Erro ao atualizar responsavel' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.responsavel.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Responsavel removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover responsavel:', error);
    res.status(500).json({ error: 'Erro ao remover responsavel' });
  }
};

module.exports = { getByEmpresa, getById, create, update, remove };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const contratos = await prisma.contrato.findMany({
      where: { empresaId: parseInt(empresaId) },
      include: { template: true },
      orderBy: { dataEnviado: 'desc' }
    });
    res.json(contratos);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({ error: 'Erro ao buscar contratos' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await prisma.contrato.findUnique({
      where: { id: parseInt(id) },
      include: { template: true }
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    res.json(contrato);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    res.status(500).json({ error: 'Erro ao buscar contrato' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, templateId, conteudo } = req.body;
    const contrato = await prisma.contrato.create({
      data: {
        empresaId: parseInt(empresaId),
        templateId: parseInt(templateId),
        conteudo
      },
      include: { template: true }
    });
    res.status(201).json(contrato);
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    res.status(500).json({ error: 'Erro ao criar contrato' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo, dataAssinado, dataConcluido, dataCancelado } = req.body;
    const contrato = await prisma.contrato.update({
      where: { id: parseInt(id) },
      data: {
        conteudo,
        dataAssinado: dataAssinado ? new Date(dataAssinado) : undefined,
        dataConcluido: dataConcluido ? new Date(dataConcluido) : undefined,
        dataCancelado: dataCancelado ? new Date(dataCancelado) : undefined
      },
      include: { template: true }
    });
    res.json(contrato);
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contrato' });
  }
};

const assinar = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await prisma.contrato.update({
      where: { id: parseInt(id) },
      data: { dataAssinado: new Date() },
      include: { template: true }
    });
    res.json(contrato);
  } catch (error) {
    console.error('Erro ao assinar contrato:', error);
    res.status(500).json({ error: 'Erro ao assinar contrato' });
  }
};

const concluir = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await prisma.contrato.update({
      where: { id: parseInt(id) },
      data: { dataConcluido: new Date() },
      include: { template: true }
    });
    res.json(contrato);
  } catch (error) {
    console.error('Erro ao concluir contrato:', error);
    res.status(500).json({ error: 'Erro ao concluir contrato' });
  }
};

const cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await prisma.contrato.update({
      where: { id: parseInt(id) },
      data: { dataCancelado: new Date() },
      include: { template: true }
    });
    res.json(contrato);
  } catch (error) {
    console.error('Erro ao cancelar contrato:', error);
    res.status(500).json({ error: 'Erro ao cancelar contrato' });
  }
};

module.exports = { getByEmpresa, getById, create, update, assinar, concluir, cancelar };

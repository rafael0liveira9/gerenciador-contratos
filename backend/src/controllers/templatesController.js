const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const templates = await prisma.template.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null
      },
      include: {
        paginas: {
          where: { dataExclusao: null },
          orderBy: { ordem: 'asc' },
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
        }
      },
      orderBy: { dataCriacao: 'desc' }
    });

    // Calcular vigência e ordenar
    const now = new Date();
    const templatesComVigencia = templates.map(template => {
      const inicioVigencia = template.inicioVigencia ? new Date(template.inicioVigencia) : null;
      const fimVigencia = template.fimVigencia ? new Date(template.fimVigencia) : null;

      const vigente = inicioVigencia && inicioVigencia <= now && (!fimVigencia || fimVigencia >= now);

      return { ...template, vigente };
    });

    // Ordenar: vigentes primeiro, depois por data de criação
    templatesComVigencia.sort((a, b) => {
      if (a.vigente && !b.vigente) return -1;
      if (!a.vigente && b.vigente) return 1;
      return new Date(b.dataCriacao) - new Date(a.dataCriacao);
    });

    res.json(templatesComVigencia);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    res.status(500).json({ error: 'Erro ao buscar templates' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await prisma.template.findUnique({
      where: { id: parseInt(id) },
      include: {
        paginas: {
          where: { dataExclusao: null },
          orderBy: { ordem: 'asc' },
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
        }
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({ error: 'Erro ao buscar template' });
  }
};

const create = async (req, res) => {
  try {
    const { empresaId, nome, descricao, versao, inicioVigencia, fimVigencia } = req.body;
    const template = await prisma.template.create({
      data: {
        empresaId: parseInt(empresaId),
        nome,
        descricao: descricao || null,
        versao: versao ? parseInt(versao) : 1,
        inicioVigencia: inicioVigencia ? new Date(inicioVigencia) : new Date(),
        fimVigencia: fimVigencia ? new Date(fimVigencia) : null,
        paginas: {
          create: {
            ordem: 1
          }
        }
      },
      include: {
        paginas: {
          orderBy: { ordem: 'asc' }
        }
      }
    });
    res.status(201).json(template);
  } catch (error) {
    console.error('Erro ao criar template:', error);
    res.status(500).json({ error: 'Erro ao criar template' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, versao, inicioVigencia, fimVigencia } = req.body;
    const template = await prisma.template.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        descricao,
        versao: versao ? parseInt(versao) : undefined,
        inicioVigencia: inicioVigencia ? new Date(inicioVigencia) : undefined,
        fimVigencia: fimVigencia ? new Date(fimVigencia) : null
      },
      include: {
        paginas: {
          where: { dataExclusao: null },
          orderBy: { ordem: 'asc' },
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
        }
      }
    });
    res.json(template);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    res.status(500).json({ error: 'Erro ao atualizar template' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.template.update({
      where: { id: parseInt(id) },
      data: { dataExclusao: new Date() }
    });
    res.json({ message: 'Template removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover template:', error);
    res.status(500).json({ error: 'Erro ao remover template' });
  }
};

module.exports = { getByEmpresa, getById, create, update, remove };

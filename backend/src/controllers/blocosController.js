const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getByPagina = async (req, res) => {
  try {
    const { paginaId } = req.params;
    const blocos = await prisma.bloco.findMany({
      where: { paginaId: parseInt(paginaId) },
      include: {
        clausula: true,
        cabecalho: true,
        rodape: true
      },
      orderBy: { ordem: 'asc' }
    });
    res.json(blocos);
  } catch (error) {
    console.error('Erro ao buscar blocos:', error);
    res.status(500).json({ error: 'Erro ao buscar blocos' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const bloco = await prisma.bloco.findUnique({
      where: { id: parseInt(id) },
      include: {
        clausula: true,
        cabecalho: true,
        rodape: true
      }
    });

    if (!bloco) {
      return res.status(404).json({ error: 'Bloco não encontrado' });
    }

    res.json(bloco);
  } catch (error) {
    console.error('Erro ao buscar bloco:', error);
    res.status(500).json({ error: 'Erro ao buscar bloco' });
  }
};

const create = async (req, res) => {
  try {
    const { paginaId, clausulaId, cabecalhoId, rodapeId, ordem, level, numeracao, htmlTag, styles, tipo, conteudo } = req.body;

    const maxOrdem = await prisma.bloco.aggregate({
      where: { paginaId: parseInt(paginaId) },
      _max: { ordem: true }
    });

    const bloco = await prisma.bloco.create({
      data: {
        paginaId: parseInt(paginaId),
        clausulaId: clausulaId ? parseInt(clausulaId) : null,
        cabecalhoId: cabecalhoId ? parseInt(cabecalhoId) : null,
        rodapeId: rodapeId ? parseInt(rodapeId) : null,
        ordem: ordem ?? (maxOrdem._max.ordem || 0) + 1,
        level: level || 1,
        numeracao,
        htmlTag: htmlTag || 'p',
        styles: styles ? JSON.stringify(styles) : null,
        conteudo: conteudo || null,
        tipo
      },
      include: {
        clausula: true,
        cabecalho: true,
        rodape: true
      }
    });
    res.status(201).json(bloco);
  } catch (error) {
    console.error('Erro ao criar bloco:', error);
    res.status(500).json({ error: 'Erro ao criar bloco' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { clausulaId, cabecalhoId, rodapeId, ordem, level, numeracao, htmlTag, styles, tipo, conteudo } = req.body;

    // Buscar o bloco atual para saber o tipo e a entidade associada
    const blocoAtual = await prisma.bloco.findUnique({
      where: { id: parseInt(id) },
      include: { clausula: true, cabecalho: true, rodape: true }
    });

    if (!blocoAtual) {
      return res.status(404).json({ error: 'Bloco não encontrado' });
    }

    let updateData = {
      clausulaId: clausulaId !== undefined ? (clausulaId ? parseInt(clausulaId) : null) : undefined,
      cabecalhoId: cabecalhoId !== undefined ? (cabecalhoId ? parseInt(cabecalhoId) : null) : undefined,
      rodapeId: rodapeId !== undefined ? (rodapeId ? parseInt(rodapeId) : null) : undefined,
      ordem,
      level,
      numeracao,
      htmlTag,
      styles: styles ? JSON.stringify(styles) : undefined,
      tipo
    };

    // Se conteudo foi enviado, atualizar a entidade associada ou salvar direto no bloco
    if (conteudo !== undefined) {
      if (blocoAtual.tipo === 'TITULO' || blocoAtual.tipo === 'OBSERVACAO') {
        // Para TITULO e OBSERVACAO, salva direto no bloco
        updateData.conteudo = conteudo;
      } else if (blocoAtual.tipo === 'CLAUSULA' && blocoAtual.clausulaId) {
        // Atualizar a cláusula existente diretamente
        await prisma.clausula.update({
          where: { id: blocoAtual.clausulaId },
          data: { conteudo: conteudo }
        });
      } else if (blocoAtual.tipo === 'CABECALHO' && blocoAtual.cabecalhoId) {
        // Atualizar o cabeçalho existente diretamente
        await prisma.cabecalho.update({
          where: { id: blocoAtual.cabecalhoId },
          data: { conteudo: conteudo }
        });
      } else if (blocoAtual.tipo === 'RODAPE' && blocoAtual.rodapeId) {
        // Atualizar o rodapé existente diretamente
        await prisma.rodape.update({
          where: { id: blocoAtual.rodapeId },
          data: { conteudo: conteudo }
        });
      }
    }

    const bloco = await prisma.bloco.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        clausula: true,
        cabecalho: true,
        rodape: true
      }
    });
    res.json(bloco);
  } catch (error) {
    console.error('Erro ao atualizar bloco:', error);
    res.status(500).json({ error: 'Erro ao atualizar bloco' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.bloco.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Bloco removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover bloco:', error);
    res.status(500).json({ error: 'Erro ao remover bloco' });
  }
};

const reorder = async (req, res) => {
  try {
    const { blocos } = req.body;

    await prisma.$transaction(
      blocos.map((bloco, index) =>
        prisma.bloco.update({
          where: { id: bloco.id },
          data: { ordem: index + 1 }
        })
      )
    );

    res.json({ message: 'Blocos reordenados com sucesso' });
  } catch (error) {
    console.error('Erro ao reordenar blocos:', error);
    res.status(500).json({ error: 'Erro ao reordenar blocos' });
  }
};

module.exports = { getByPagina, getById, create, update, remove, reorder };

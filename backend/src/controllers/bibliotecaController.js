const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const search = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const searchLower = search.toLowerCase();

    // Buscar clausulas
    const clausulas = await prisma.clausula.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null,
        OR: searchLower ? [
          { nome: { contains: searchLower } },
          { conteudo: { contains: searchLower } }
        ] : undefined
      },
      orderBy: { dataCriacao: 'desc' }
    });

    // Buscar cabecalhos
    const cabecalhos = await prisma.cabecalho.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null,
        OR: searchLower ? [
          { nome: { contains: searchLower } },
          { conteudo: { contains: searchLower } }
        ] : undefined
      },
      orderBy: { dataCriacao: 'desc' }
    });

    // Buscar rodapes
    const rodapes = await prisma.rodape.findMany({
      where: {
        empresaId: parseInt(empresaId),
        dataExclusao: null,
        OR: searchLower ? [
          { nome: { contains: searchLower } },
          { conteudo: { contains: searchLower } }
        ] : undefined
      },
      orderBy: { dataCriacao: 'desc' }
    });

    // Filtrar por tipo se pesquisar "clausula", "cabecalho" ou "rodape"
    let items = [];

    const isSearchingClausula = searchLower.includes('clausula') || searchLower.includes('cláusula');
    const isSearchingCabecalho = searchLower.includes('cabecalho') || searchLower.includes('cabeçalho');
    const isSearchingRodape = searchLower.includes('rodape') || searchLower.includes('rodapé');

    // Adicionar tipo a cada item
    const clausulasWithType = clausulas.map(c => ({ ...c, tipo: 'CLAUSULA' }));
    const cabecalhosWithType = cabecalhos.map(c => ({ ...c, tipo: 'CABECALHO' }));
    const rodapesWithType = rodapes.map(r => ({ ...r, tipo: 'RODAPE' }));

    // Se pesquisar por tipo específico, incluir todos desse tipo
    if (isSearchingClausula || isSearchingCabecalho || isSearchingRodape) {
      if (isSearchingClausula) items = [...items, ...clausulasWithType];
      if (isSearchingCabecalho) items = [...items, ...cabecalhosWithType];
      if (isSearchingRodape) items = [...items, ...rodapesWithType];
    } else {
      // Caso contrário, combinar todos
      items = [...clausulasWithType, ...cabecalhosWithType, ...rodapesWithType];
    }

    // Ordenar por data de criação (mais recente primeiro)
    items.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

    // Total de itens
    const total = items.length;

    // Aplicar paginação
    const paginatedItems = items.slice(skip, skip + take);

    res.json({
      items: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error);
    res.status(500).json({ error: 'Erro ao buscar biblioteca' });
  }
};

module.exports = { search };

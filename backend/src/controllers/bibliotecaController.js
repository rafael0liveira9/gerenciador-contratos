const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CLAUSULA_ALIASES = ['clausula', 'cláusula', 'claus', 'clause'];
const CABECALHO_ALIASES = ['cabecalho', 'cabeçalho', 'cabeca', 'cabeça', 'head', 'heade', 'header'];
const RODAPE_ALIASES = ['rodape', 'rodapé', 'foot', 'foote', 'footer'];

const search = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const searchLower = search.toLowerCase().trim();

    const isSearchingClausula = CLAUSULA_ALIASES.some(alias => searchLower === alias || searchLower.startsWith(alias));
    const isSearchingCabecalho = CABECALHO_ALIASES.some(alias => searchLower === alias || searchLower.startsWith(alias));
    const isSearchingRodape = RODAPE_ALIASES.some(alias => searchLower === alias || searchLower.startsWith(alias));
    const isSearchingByType = isSearchingClausula || isSearchingCabecalho || isSearchingRodape;

    const searchAsId = parseInt(searchLower.replace('#', ''));
    const isSearchingById = !isNaN(searchAsId) && searchAsId > 0;

    const buildSearchFilter = (empresaIdInt) => {
      const baseFilter = {
        empresaId: empresaIdInt,
        dataExclusao: null
      };

      if (isSearchingByType) {
        return baseFilter;
      }

      if (!searchLower) {
        return baseFilter;
      }

      const orConditions = [
        { nome: { contains: searchLower } },
        { conteudo: { contains: searchLower } }
      ];

      if (isSearchingById) {
        orConditions.push({ id: searchAsId });
      }

      return {
        ...baseFilter,
        OR: orConditions
      };
    };

    const empresaIdInt = parseInt(empresaId);
    const searchFilter = buildSearchFilter(empresaIdInt);

    let clausulas = [];
    let cabecalhos = [];
    let rodapes = [];

    if (isSearchingByType) {
      if (isSearchingClausula) {
        clausulas = await prisma.clausula.findMany({
          where: { empresaId: empresaIdInt, dataExclusao: null },
          orderBy: { dataCriacao: 'desc' }
        });
      }
      if (isSearchingCabecalho) {
        cabecalhos = await prisma.cabecalho.findMany({
          where: { empresaId: empresaIdInt, dataExclusao: null },
          orderBy: { dataCriacao: 'desc' }
        });
      }
      if (isSearchingRodape) {
        rodapes = await prisma.rodape.findMany({
          where: { empresaId: empresaIdInt, dataExclusao: null },
          orderBy: { dataCriacao: 'desc' }
        });
      }
    } else {

      [clausulas, cabecalhos, rodapes] = await Promise.all([
        prisma.clausula.findMany({
          where: searchFilter,
          orderBy: { dataCriacao: 'desc' }
        }),
        prisma.cabecalho.findMany({
          where: searchFilter,
          orderBy: { dataCriacao: 'desc' }
        }),
        prisma.rodape.findMany({
          where: searchFilter,
          orderBy: { dataCriacao: 'desc' }
        })
      ]);
    }

    const clausulasWithType = clausulas.map(c => ({ ...c, tipo: 'CLAUSULA' }));
    const cabecalhosWithType = cabecalhos.map(c => ({ ...c, tipo: 'CABECALHO' }));
    const rodapesWithType = rodapes.map(r => ({ ...r, tipo: 'RODAPE' }));

    let items = [...clausulasWithType, ...cabecalhosWithType, ...rodapesWithType];

    items.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

    const total = items.length;

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

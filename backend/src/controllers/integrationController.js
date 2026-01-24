const { PrismaClient } = require('@prisma/client');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { saveLog } = require('../middleware/integrationAuth');

const prisma = new PrismaClient();

/**
 * GET /api/v1/templates
 * Lista todos os templates da empresa autenticada
 */
const getTemplates = async (req, res) => {
  try {
    const empresa = req.empresa;

    // Salvar log se fornecido
    if (req.body?.log) {
      await saveLog(empresa.id, req.body.log);
    }

    const templates = await prisma.template.findMany({
      where: {
        empresaId: empresa.id,
        dataExclusao: null
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        versao: true,
        dataCriacao: true,
        dataEdicao: true
      },
      orderBy: { dataCriacao: 'desc' }
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar templates'
    });
  }
};

/**
 * GET /api/v1/templates/:id
 * Retorna um template específico com suas variáveis
 */
const getTemplateById = async (req, res) => {
  try {
    const empresa = req.empresa;
    const { id } = req.params;

    // Salvar log se fornecido
    if (req.body?.log) {
      await saveLog(empresa.id, req.body.log);
    }

    const template = await prisma.template.findFirst({
      where: {
        id: parseInt(id),
        empresaId: empresa.id,
        dataExclusao: null
      },
      include: {
        paginas: {
          where: { ativo: true },
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
      return res.status(404).json({
        success: false,
        error: 'Template não encontrado'
      });
    }

    // Extrair variáveis do template
    const allContent = template.paginas.flatMap(pagina =>
      pagina.blocos.map(bloco => {
        if (bloco.tipo === 'CLAUSULA') return bloco.clausula?.conteudo || '';
        if (bloco.tipo === 'CABECALHO') return bloco.cabecalho?.conteudo || '';
        if (bloco.tipo === 'RODAPE') return bloco.rodape?.conteudo || '';
        return bloco.conteudo || '';
      })
    ).join(' ');

    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [...allContent.matchAll(regex)];
    const variaveis = [...new Set(matches.map(m => m[1].trim()))];

    res.json({
      success: true,
      data: {
        id: template.id,
        nome: template.nome,
        descricao: template.descricao,
        versao: template.versao,
        variaveis: variaveis.map(tag => ({ tag }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar template'
    });
  }
};

/**
 * POST /api/v1/contracts/generate
 * Gera um contrato PDF a partir de um template e variáveis
 */
const generateContract = async (req, res) => {
  try {
    const empresa = req.empresa;
    const { templateId, variaveis, log } = req.body;

    // Salvar log se fornecido
    if (log) {
      await saveLog(empresa.id, log);
    }

    if (!templateId) {
      return res.status(400).json({
        success: false,
        error: 'templateId é obrigatório'
      });
    }

    if (!variaveis || typeof variaveis !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'variaveis deve ser um objeto com as variáveis do template'
      });
    }

    // Buscar template com blocos
    const template = await prisma.template.findFirst({
      where: {
        id: parseInt(templateId),
        empresaId: empresa.id,
        dataExclusao: null
      },
      include: {
        paginas: {
          where: { ativo: true },
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
      return res.status(404).json({
        success: false,
        error: 'Template não encontrado'
      });
    }

    // Gerar conteúdo HTML do template
    const templateContent = template.paginas.flatMap(pagina =>
      pagina.blocos.map(bloco => {
        let content = '';
        if (bloco.tipo === 'CLAUSULA') content = bloco.clausula?.conteudo || '';
        else if (bloco.tipo === 'CABECALHO') content = bloco.cabecalho?.conteudo || '';
        else if (bloco.tipo === 'RODAPE') content = bloco.rodape?.conteudo || '';
        else content = bloco.conteudo || '';

        const Tag = bloco.htmlTag || 'div';
        return `<${Tag}>${content}</${Tag}>`;
      })
    ).join('\n');

    // Criar diretório para documentos
    const docsDir = path.join(__dirname, '../../public/documentos', String(empresa.id));
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Compilar template com Handlebars
    const compiledTemplate = Handlebars.compile(templateContent, { noEscape: true });

    const contexto = {};
    for (const [key, value] of Object.entries(variaveis || {})) {
      contexto[key] = new Handlebars.SafeString(value);
    }

    const htmlFinal = compiledTemplate(contexto);

    const htmlCompleto = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            padding: 20mm;
          }
          p {
            margin-bottom: 12px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-bottom: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          td, th {
            border: 1px solid #000;
            padding: 8px;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        ${htmlFinal}
      </body>
      </html>
    `;

    // Gerar PDF com Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlCompleto, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await browser.close();

    // Salvar PDF
    const fileName = `contrato_${Date.now()}.pdf`;
    const filePath = path.join(docsDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const pdfPath = `/public/documentos/${empresa.id}/${fileName}`;

    // Salvar no banco
    const documento = await prisma.documento.create({
      data: {
        empresaId: empresa.id,
        templateId: parseInt(templateId),
        pdfPath: pdfPath
      }
    });

    // Retornar URL do PDF
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.json({
      success: true,
      data: {
        id: documento.id,
        pdfUrl: `${baseUrl}${pdfPath}`,
        pdfPath: pdfPath
      }
    });
  } catch (error) {
    console.error('Erro ao gerar contrato:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar contrato: ' + error.message
    });
  }
};

module.exports = { getTemplates, getTemplateById, generateContract };

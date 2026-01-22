const { PrismaClient } = require('@prisma/client');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const gerar = async (req, res) => {
  try {
    const { empresaId, templateId, template, variaveis } = req.body;

    if (!empresaId || !templateId || !template?.content) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const docsDir = path.join(__dirname, '../../public/documentos', String(empresaId));
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const compiledTemplate = Handlebars.compile(template.content, { noEscape: true });

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

    const fileName = `documento_${Date.now()}.pdf`;
    const filePath = path.join(docsDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const pdfPath = `/public/documentos/${empresaId}/${fileName}`;

    const documento = await prisma.documento.create({
      data: {
        empresaId: parseInt(empresaId),
        templateId: parseInt(templateId),
        pdfPath: pdfPath
      }
    });

    res.json({
      id: documento.id,
      pdfPath: pdfPath,
      message: 'Documento gerado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao gerar documento:', error);
    res.status(500).json({ error: 'Erro ao gerar documento: ' + error.message });
  }
};

const getByEmpresa = async (req, res) => {
  try {
    const { empresaId } = req.params;
    const documentos = await prisma.documento.findMany({
      where: { empresaId: parseInt(empresaId) },
      include: { template: true },
      orderBy: { dataEnviado: 'desc' }
    });
    res.json(documentos);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await prisma.documento.findUnique({
      where: { id: parseInt(id) },
      include: { template: true, empresa: true }
    });

    if (!documento) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    res.json(documento);
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({ error: 'Erro ao buscar documento' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const documento = await prisma.documento.findUnique({
      where: { id: parseInt(id) }
    });

    if (!documento) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    const filePath = path.join(__dirname, '../..', documento.pdfPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.documento.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Documento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover documento:', error);
    res.status(500).json({ error: 'Erro ao remover documento' });
  }
};

module.exports = { gerar, getByEmpresa, getById, remove };
